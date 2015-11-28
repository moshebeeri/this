'use strict';

//var Logger = require('./logger');
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()//,
    //new (winston.transports.File)({ filename: 'somefile.logger' })
  ]
});


exports.createLogger = function createLogger() {
//  return new Logger(params);
  return logger;
};
