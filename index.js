var _ = require('lodash'),
  Promise = require('bluebird'),
  fs = require('fs'),
  pathUtil = require('path');

function lift () {
  var self = this;
  var root = process.cwd(), configPath = pathUtil.join(root, 'config');

  self.config = {
    paths: {
      root: root,
      config: configPath,
      envConfig: pathUtil.join(configPath, 'env')
    }
  };

  return Promise.fromCallback(function (done) {
    return fs.readdir(configPath, done);
  })
  .each(function (fileName) {
    var filePath = pathUtil.join(configPath, fileName);
    var extname = pathUtil.extname(filePath);
    if(extname !== '.js') {
      return;
    }
    return Promise.fromCallback(function (done) {
      return fs.stat(filePath, done);
    })
    .then(function (stat) {
      if(stat.isFile()) {
        _.merge(self.config, require(filePath));
      }
    });
  })
  .then(function () {
    var envConfigfilePath = pathUtil.join(self.config.paths.envConfig, self.environment);
    _.merge(self.config, require(envConfigfilePath));
  });
};

module.exports = lift;