'use strict';

let _ = require('lodash');
let config = require('../../config/environment');

let https = require('https');
let logger = require('../logger').createLogger();

function Location() {
}

function defined(obj){
  return (typeof obj !== 'undefined' && obj !== null);
}

function format_address(addressed) {
  let str = addressed.address;
  if(defined(addressed.address2))
    str += '+' + addressed.address2;
  if(defined(addressed.city))
    str += '+' + addressed.city;
  if(defined(addressed.country))
    str += '+' + addressed.country;
  if(defined(addressed.state))
    str += '+' + addressed.state;
  return str;
}


Location.prototype.address_location = function address_location(addressed, callback) {
  if(defined(addressed.lat) && defined(addressed.lng))
    return callback(null, {lat: addressed.lat, lng: addressed.lng});
  else if(defined(addressed.location) && defined(addressed.location.lat) && defined(addressed.location.lng))
    return callback(null, {lat: addressed.location.lat, lng: addressed.location.lng});

  let address = format_address(addressed);
  geocode_address(address, function (err, data) {
    if (err) {
      if(err === 'bad address'){
        return callback({
          code: 204,
          message: 'bad address : ' + address
        }, null);
      }
      return callback(err, data);
    }
    //logger.info(data);
    if (!data.results || data.results.length === 0)
      return callback({
        code: 204,
        message: 'No location under this address : ' + address
      }, null);

    if (data.results.length > 1)
      return callback({
        code: 202,
        message: 'Inconsistent address, google api find more then one location under this address : ' + address
      }, data);

    //logger.info("lat:" + data.results[0].geometry.location.lat);
    //logger.info("lng:" + data.results[0].geometry.location.lng);
    let location = data.results[0].geometry.location;
    return callback(null, {lat: location.lat, lng: location.lng});
  });
};

Location.prototype.address = function address(address, callback) {
  return geocode_address(address, callback);
};

/***
 * @param address
 * @param callback
 *
 * see: https://nodejs.org/docs/latest/api/https.html#https_https_get_options_callback
 *Herzel 7,Tel-Aviv,Israel
 * https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=mykey
 * {
 *   "results" : [],
 *   "status" : "ZERO_RESULTS"
 * }
 *
 */
function geocode_address(address, callback) {
  let path = '/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + config.google_maps.key;
  let options = {
    hostname: 'maps.googleapis.com',
    port: 443,
    path: path,
    method: 'GET'
  };
  let req = https.request(options, function (res) {
    logger.info("statusCode: ", res.statusCode);
    logger.info("headers: ", res.headers);
    let body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        callback('bad request: ' + e.message, null);
      }
      if (parsed && parsed.status === 'OK')
        callback(null, parsed);
      else
        callback('bad address', null);

    });
  });
  req.end();

  req.on('error', function (e) {
    logger.error(e.message);
    callback('HTTP_ERROR ' + e.message, null)
  });
}

module.exports = Location;
