'use strict';

let _ = require('lodash');
let PointOfSale = require('./pointOfSale.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('pointOfSale');


function checkUserFollows(userId, businessId, callback) {
  callback(null, true);
}

function checkUserRole(userId, businessId, callback) {
  callback(null, true);
}

function getDiscounts(userId, businessId, products, callback){
  let discounts = [];
  products.forEach(product => {
    discounts.push({
      product: product,
      instance: null
    })
  })
}

// Get list of pointOfSales
exports.userRequestDiscounts = function(req, res) {
  let userId = req.user._id;
  let businessId = req.params.businessId;
  let products = req.body.products;
  checkUserFollows(userId, businessId, function(err, follows){
    if(err) { return handleError(res, err); }
    if(!follows) return res.status(404).send(new Error('user is not following business nor one of its groups'));
    getDiscounts(userId, businessId, products, function (err, discounts) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(discounts);
    })
  })
};

// Get list of pointOfSales
exports.businessRequestDiscounts = function(req, res) {
  let userId = req.params.userId;
  let businessId = req.params.businessId;
  let requester = req.user._id;
  let products = req.body.products;
  checkUserRole(requester, businessId, function(err, role){
    if(err) { return handleError(res, err); }
    if(!role) return res.status(404).send(new Error('unauthorised request'));
    getDiscounts(userId, businessId, products, function (err, discounts) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(discounts);
    })
  })
};

// Get list of pointOfSales
exports.index = function(req, res) {
  PointOfSale.find(function (err, pointOfSales) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pointOfSales);
  });
};

// Get a single pointOfSale
exports.show = function(req, res) {
  PointOfSale.findById(req.params.id, function (err, pointOfSale) {
    if(err) { return handleError(res, err); }
    if(!pointOfSale) { return res.status(404); }
    return res.json(pointOfSale);
  });
};

// Creates a new pointOfSale in the DB.
exports.create = function(req, res) {
  PointOfSale.create(req.body, function(err, pointOfSale) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(pointOfSale, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.status(201).json(pointOfSale);
  });
};

// Updates an existing pointOfSale in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  PointOfSale.findById(req.params.id, function (err, pointOfSale) {
    if (err) { return handleError(res, err); }
    if(!pointOfSale) { return res.send(404); }
    let updated = _.merge(pointOfSale, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pointOfSale);
    });
  });
};

// Deletes a pointOfSale from the DB.
exports.destroy = function(req, res) {
  PointOfSale.findById(req.params.id, function (err, pointOfSale) {
    if(err) { return handleError(res, err); }
    if(!pointOfSale) { return res.status(404); }
    pointOfSale.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
