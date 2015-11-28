
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()//,
    //new (winston.transports.File)({ filename: 'somefile.logger' })
  ]
});

function Logger() {
  this.prototype.logger = logger;
}

Logger.prototype.get = function get() {
  return this.prototype.logger;
}
module.exports = Logger;
