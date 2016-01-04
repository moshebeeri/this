'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var logger = require('../../components/logger').createLogger();
var User = require('../user/user.model');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('business');

var location = require('../../components/location').createLocation();


exports.address2 = function(req, res) {
  location.address( req.body.address, function(err, data){
    if(err) {return handleError(res, err);}
    //logger.info(data);
    if(data.results==0)
      return res.status(400).send('No location under this address : ' + req.body.address );

    if(data.results.length > 1)
      return res.status(400).send('Inconsistent address, google api find more then one location under this address : ' + req.body.address );

    logger.info("lat:" +data.results[0].geometry.location.lat);
    logger.info("lng:" +data.results[0].geometry.location.lng);
    return res.status(200).send();
  });
};

exports.address = function(req, res) {
  location.address_location( req.body.address, function(err, data){
    if(err) return res.status(err.res).send(err.message);
    return res.status(200).json(data);
  });
};


// Get list of businesses
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

function defined(obj){
  return (typeof obj !== 'undefined' && obj !== null);
}

function format_address(business) {
  var str = business.address;
  if(defined(business.address2))
    str += ',' + business.address2;
  if(defined(business.city))
    str += ',' + business.city;
  if(defined(business.country))
    str += ',' + business.country;
  if(defined(business.state))
    str += ',' + business.state;
  return str;
  //return business.address + ',' + business.address2 + ',' + business.city + ',' + business.country + ',' + business.state;
}
exports.create = function(req, res) {
  var creator = null;
  var body_business = req.body;
  var userId = req.user._id;
  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    creator = user;
  });
  body_business.creator = userId;
  location.address_location( format_address(body_business), function(err, data){
    if(err) return res.status(401).send(err.message);
    body_business.location = {
      lat : data.lat,
      lon: data.lng
    };
    console.log(body_business.location);
    Business.create(body_business, function(err, business) {
      if(err) { return handleError(res, err); }
      graphModel.reflect(business, {
        _id: business._id,
        name: business.name,
        creator: business.creator
      }, function (err, business ) {
        if (err) {  return handleError(res, err); }
        graphModel.db().relate(creator.gid, 'OWNS', business.gid, {}, function(err, relationship) {
          if(err) {console.log(err.message);}
          logger.info('(' + relationship.start + ')-[' + relationship.type + ']->(' + relationship.end + ')');
        });
      });
      return res.status(201).json(business);
    });
  });
};

// Updates an existing business in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Business.findById(req.params.id, function (err, business) {
    if (err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    var updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroy = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    business.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
