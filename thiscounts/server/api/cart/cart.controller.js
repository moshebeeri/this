'use strict';

let _ = require('lodash');
let Cart = require('./cart.model.js');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('cart');

// Get list of carts
exports.index = function(req, res) {
  Cart.find(function (err, carts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(carts);
  });
};

// Get a single cart
exports.show = function(req, res) {
  Cart.findById(req.params.id, function (err, cart) {
    if(err) { return handleError(res, err); }
    if(!cart) { return res.status(404).send(); }
    return res.status(200).json(cart);
  });
};

// Creates a new cart in the DB.
exports.create = function(req, res) {
  Cart.create(req.body, function(err, cart) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(cart, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.status(201).json(cart);
  });
};

// Updates an existing cart in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cart.findById(req.params.id, function (err, cart) {
    if (err) { return handleError(res, err); }
    if(!cart) { return res.status(404).send(); }
    let updated = _.merge(cart, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(cart);
    });
  });
};

// Deletes a cart from the DB.
exports.destroy = function(req, res) {
  Cart.findById(req.params.id, function (err, cart) {
    if(err) { return handleError(res, err); }
    if(!cart) { return res.status(404).send(); }
    cart.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send();
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err.message);
}
