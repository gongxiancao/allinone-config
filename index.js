var pathUtil = require('path'),
  fs = require('fs'),
  _ = require('lodash');

module.exports = function (done) {
  var filePath, extname, stat, self = this;

  var root = process.cwd(), configPath = pathUtil.join(root, 'config');
    fileNames = fs.readdirSync(configPath);

  self.config = {
    paths: {
      root: root,
      config: configPath,
      envConfig: pathUtil.join(configPath, 'env')
    }
  };

  fileNames.forEach(function (fileName) {
    filePath = pathUtil.join(self.config.paths.config, fileName);
    stat = fs.statSync(filePath);
    extname = pathUtil.extname(filePath);
    if(stat && stat.isFile && extname === '.js') {
      _.merge(self.config, require(filePath));
    }
  });

  var filePath = pathUtil.join(self.config.paths.envConfig, self.environment);
  _.merge(self.config, require(filePath));

  process.nextTick(done);
};
