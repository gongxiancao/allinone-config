var _ = require('lodash'),
  fs = require('fs'),
  async = require('async'),
  Promise = require('bluebird'),
  pathUtil = require('path');

function lift (done) {
  var self = this;
  var root = process.cwd(), configPath = pathUtil.join(root, 'config');

  self.config = {
    paths: {
      root: root,
      config: configPath,
      envConfig: pathUtil.join(configPath, 'env')
    }
  };

  fs.readdir(configPath, function (err, fileNames) {
    async.each(fileNames, function (fileName, done) {
      var filePath = pathUtil.join(configPath, fileName);
      var extname = pathUtil.extname(filePath);
      if(extname !== '.js') {
        return done();
      }
      fs.stat(filePath, function (err, stat) {
        if(err) {
          return done();
        }

        if(stat.isFile()) {
          _.merge(self.config, require(filePath));
        }
        done();
      });
    }, function () {
      var envConfigfilePath = pathUtil.join(self.config.paths.envConfig, self.environment);
      _.merge(self.config, require(envConfigfilePath));
      done();
    });
  });
};

module.exports = Promise.promisify(lift);