'use strict';

let _ = require('lodash');
let Pricing = require('./pricing.model');
let location = require('../../components/location').createLocation();
let MongodbSearch = require('../../components/mongo-search');


exports.search = MongodbSearch.create(Pricing);

// Get list of pricings
exports.index = function(req, res) {
  Pricing.find(function (err, pricings) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pricings);
  });
};

// Get a single pricing
exports.show = function(req, res) {
  Pricing.findById(req.params.id, function (err, pricing) {
    if(err) { return handleError(res, err); }
    if(!pricing) { return res.status(404).send('Not Found'); }
    return res.json(pricing);
  });
};

// Creates a new pricing in the DB.
exports.create = function(req, res) {
  Pricing.create(req.body, function(err, invite) {
    if(err) { return handleError(res, err); }
    return res.json(201, invite);
  });
};

// Updates an existing pricing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pricing.findById(req.params.id, function (err, pricing) {
    if (err) { return handleError(res, err); }
    if(!pricing) { return res.status(404).send('Not Found'); }
    let updated = _.merge(pricing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pricing);
    });
  });
};

// Deletes a pricing from the DB.
exports.destroy = function(req, res) {
  Pricing.findById(req.params.id, function (err, pricing) {
    if(err) { return handleError(res, err); }
    if(!pricing) { return res.status(404).send('Not Found'); }
    pricing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
