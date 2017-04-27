'use strict';

var _ = require('lodash');
var Product = require('./product.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('product');
var utils = require('../../components/utils').createUtils();
var activity = require('../../components/activity').createActivity();

// Get list of products
exports.index = function (req, res) {
  Product.find(function (err, products) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, products);
  });
};

// Get list of products
exports.index_paginated = function (req, res) {
  let userId = req.user._id;
  let skip = req.params.skip;
  let limit = req.params.limit;

  Product.find({business: req.params.id})
    .skip(skip)
    .limit(limit)
    .exec(function (err, products) {
      if (err)
        return handleError(res, err);
      return res.status(200).json(products);
    });
};

// Get a single product
exports.show = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    return res.json(product);
  });
};

exports.find_by_business = function (req, res) {
  Product.find({business: req.params.id}, function (err, products) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(products);
  });
};

// Creates a new product in the DB.
exports.create = function (req, res) {
  Product.create(req.body, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(product, {
      name: product.name,
      info: product.info,
      retail_price: product.retail_price
    }, function (err, product) {
      if (err)
        return handleError(res, err);
      graphModel.relate_ids(product._id, 'CREATED_BY', req.user._id);
      if(utils.defined(product.business)){
        graphModel.relate_ids(product.business, 'SELL', product._id);
        activity.create({
          product: product._id,
          actor_business: product.business,
          action: "created"
        });
      }
      return res.status(201).json(product);
    });
  });
};

exports.user_products = function (req, res) {
  let userID = req.user._id;
  let skip =  req.params.skip;
  let limit = req.params.limit;
  graphModel.query_objects(Product,
    `MATCH (u:user {_id:'${userID}'})<-[r:CREATED_BY]-(p:product) RETURN p._id as _id`,
    'order by p.created DESC', skip, limit, function (err, products) {
      if (err) return handleError(res, err);
      return res.status(200).json(products);
    });
};

// Updates an existing product in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    var updated = _.merge(product, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(product);
    });
  });
};

// Deletes a product from the DB.
exports.destroy = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    product.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
