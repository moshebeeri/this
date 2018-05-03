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

  console.log(JSON.stringify(addressed));
  if( !addressed.city || !addressed.address || !addressed.country ||
    addressed.city === "" || addressed.address === "" || addressed.country === "" ) {
    return callback({
      code: 400,
      message: `bad address :   ${JSON.stringify(addressed)}`
    }, null);
  }
  let address = format_address(addressed);
  geocode_address(address, function (err, data) {
    if (err) {
      if(err.startsWith('bad address no street_address found')) {
        return callback({
          code: 400,
          message: `${err} ${JSON.stringify(address)}`
        }, null);
      }else if(err.startsWith('bad address')){
        return callback({
          code: 204,
          message: 'bad address: ' + address
        }, null);
      }
      else return callback({code: 400,message:err}, data);
    }else{
      if (!data.results || data.results.length === 0)
        return callback({
          code: 204,
          message: 'No location under this address : ' + address
        }, null);

      else if (data.results.length > 1)
        return callback({
          code: 202,
          message: 'Inconsistent address, google api find more then one location under this address : ' + address
        }, data);
      else {
        let location = data.results[0].geometry.location;
        return callback(null, {lat: location.lat, lng: location.lng});
      }
    }
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
    // logger.info("statusCode: ", res.statusCode);
    // logger.info("headers: ", res.headers);
    let body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        callback('bad address: ' + e.message, null);
      }
      if (parsed && parsed.status === 'OK') {
        const streetAddress = parsed.results.filter(result => _.includes(result.types, 'street_address'));
        if(streetAddress.length === 0){
          return callback(`bad address no street_address found`, null);
        }
        callback(null, parsed);
      }
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
