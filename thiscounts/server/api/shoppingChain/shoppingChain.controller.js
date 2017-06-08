'use strict';

let _ = require('lodash');
let ShoppingChain = require('./shoppingChain.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('shoppingChain');

// Get list of shoppingChains
exports.index = function(req, res) {
  ShoppingChain.find(function (err, shoppingChains) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(shoppingChains);
  });
};

// Get a single shoppingChain
exports.show = function(req, res) {
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if(err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    return res.json(shoppingChain);
  });
};

// Creates a new shoppingChain in the DB.
exports.create = function(req, res) {
  ShoppingChain.create(req.body, function(err, shoppingChain) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(shoppingChain, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.status(201).json(shoppingChain);
  });
};

// Updates an existing shoppingChain in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if (err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    let updated = _.merge(shoppingChain, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(shoppingChain);
    });
  });
};

// Deletes a shoppingChain from the DB.
exports.destroy = function(req, res) {
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if(err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    shoppingChain.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
