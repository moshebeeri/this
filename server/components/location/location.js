'use strict';

var _ = require('lodash');
var config = require('../../config/environment');

var https = require('https');
var logger = require('../logger').createLogger();

function Location() {
}


/***
 * @param address
 * @param callback
 *
 * see: https://nodejs.org/docs/latest/api/https.html#https_https_get_options_callback
 *
 * https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=mykey
 * {
 *   "results" : [],
 *   "status" : "ZERO_RESULTS"
 * }
 *
 */
Location.prototype.address = function address(address, callback) {
  var path = '/maps/api/geocode/json?address=' + address + '&key=' + config.google_maps.key;
  var options = {
    hostname: 'maps.googleapis.com',
    port: 443,
    path: path,
    method: 'GET'
  };
  var req = https.request(options, function(res) {
    logger.info("statusCode: ", res.statusCode);
    logger.info("headers: ", res.headers);
    var body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      var parsed = JSON.parse(body);
      if (parsed.status === 'OK')
        callback(null, parsed);
      else
        callback('BAD_ADDRESS', null);

    });
  });
  req.end();

  req.on('error', function(e) {
    logger.error(e.message);
    callback('HTTP_ERROR ' + e.message, null)
  });
};

module.exports = Location;
