var pathUtil = require('path'),
  fs = require('fs');

module.exports = function (app, done) {
  var filePath, extname, stat,
    fileNames = fs.readdirSync(app.config.paths.config);

  fileNames.forEach(function (fileName) {
    filePath = pathUtil.join(app.config.paths.config, fileName);
    stat = fs.statSync(filePath);
    extname = pathUtil.extname(filePath);
    if(stat && stat.isFile && extname === '.js') {
      _.merge(app.config, require(filePath));
    }
  });

  var filePath = pathUtil.join(app.config.paths.envConfig, app.environment);
  _.merge(app.config, require(filePath));

  process.nextTick(done);
};
