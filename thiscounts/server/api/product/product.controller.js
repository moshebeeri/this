'use strict';

let _ = require('lodash');
let Product = require('./product.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('product');
let barcodeGraphModel = graphTools.createGraphModel('barcode');
let utils = require('../../components/utils').createUtils();
let activity = require('../../components/activity').createActivity();


graphModel.db().constraints.uniqueness.createIfNone('barcode', 'code');


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

exports.find_by_barcode = function (req, res) {
  Product.find({barcode: req.params.barcode})
    .skip(req.params.skip)
    .limit(req.params.limit)
    .exec( function (err, products) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(products);
  });
};

function handleBarcode(product_id, barcode) {
  barcodeGraphModel.save({code:barcode}, function (err, barcode) {
    if (err) console.log( 'unable to handle barcode save', err);
    let create = `MATCH (product:product{_id:"${product_id}"}), (barcode:barcode) where id(barcode)=${barcode.id} 
                  CREATE (product)-[:BARCODE]->(barcode)`;
    barcodeGraphModel.query(create, function (err) {
      if (err) console.log( 'unable to create barcode relationship', err);
    })
  })
}

// Creates a new product in the DB.
exports.create = function (req, res) {
  Product.create(req.body, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(product, {
      _id: product._id,
      name: product.name,
      info: product.info,
      barcode: product.barcode,
      retail_price: product.retail_price
    }, function (err, g_product) {
      if (err)
        return handleError(res, err);
      graphModel.relate_ids(g_product._id, 'CREATED_BY', req.user._id);
      if(product.barcode)
        handleBarcode(product._id, product.barcode);
      if(utils.defined(g_product.business)){
        graphModel.relate_ids(g_product.business, 'SELL', g_product._id);
        activity.create({
          product: g_product._id,
          actor_business: g_product.business,
          action: 'created'
        });
      }
      return res.status(201).json(g_product);
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
    let updated = _.merge(product, req.body);
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
