var pathUtil = require('path'),
  fs = require('fs');

module.exports = function (done) {
  var filePath, extname, stat, self = this;
    fileNames = fs.readdirSync(app.config.paths.config);

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
