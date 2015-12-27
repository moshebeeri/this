'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var logger = require('../../components/logger').createLogger();
var User = require('../user/user.model');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('business');

var location = require('../../components/location').createLocation();


exports.address = function(req, res) {
  location.address( req.body.address, function(err, data){
    if(err) {return handleError(res, err);}
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

// Creates a new business in the DB.
exports.create = function(req, res) {
  var owner = null;
  User.findById(req.body.owner, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    owner = user;
  });

  Business.create(req.body, function(err, business) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(business, {
      _id: business._id,
      name: business.name,
      owner: business.owner
    }, function (err, business ) {
      if (err) {  return handleError(res, err); }
      graphModel.db().relate(owner.gid, 'OWNS', business.gid, {}, function(err, relationship) {
        if(err) {console.log(err.message);}
        logger.info('(' + relationship.start + ')-[' + relationship.type + ']->(' + relationship.end + ')');
      });
    });
    return res.status(201).json(business);
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
