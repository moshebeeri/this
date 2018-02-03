'use strict';

let _ = require('lodash');
let Product = require('./product.model');
let Business = require('../business/business.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('product');
let barcodeGraphModel = graphTools.createGraphModel('barcode');
const utils = require('../../components/utils').createUtils();
let activity = require('../../components/activity').createActivity();
let MongodbSearch = require('../../components/mongo-search');

barcodeGraphModel.model.setUniqueKey('code', true);

// graphModel.db().constraints.uniqueness.createIfNone('barcode', 'code', function (err) {
//   if(err) console.error(err);
// });

exports.search = MongodbSearch.create(Product);

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

// exports.find_by_business = function (req, res) {
//   Product.find({business: req.params.id}, function (err, products) {
//     if (err) {
//       return handleError(res, err);
//     }
//     return res.status(200).json(products);
//   });
// };

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

function handleBarcode(product) {
  //code should be unique, if exits old one should be returned
  barcodeGraphModel.save({code: product.barcode}, function (err, barcode) {
    if (err) console.log( 'unable to handle barcode save', err);
    let create = `MATCH (product:product{_id:"${product._id}"}), (barcode:barcode) where id(barcode)=${barcode.id} 
                    CREATE (product)-[:BARCODE]->(barcode)`;
    barcodeGraphModel.query(create, function (err) {
      if (err) console.log( 'unable to create barcode relationship', err);
    })
  })
}

function handleEntities(product) {
  const productId = product._id;
  if (utils.defined(product.business)) {
    graphModel.relate_ids(product.business, 'SELL', productId);
    activity.create({
      product: product._id,
      actor_business: product.business,
      action: 'sell'
    });
  }
  if (utils.defined(product.shoppingChain)) {
    graphModel.relate_ids(product.shoppingChain, 'SELL', productId);
    activity.create({
      product: product._id,
      actor_chain: product.shoppingChain,
      action: 'sell'
    });
  }
  if (utils.defined(product.brand)) {
    graphModel.relate_ids(product.brand, 'BRANDED', productId);
    activity.create({
      product: product._id,
      actor_brand: product.brand,
      action: 'branded'
    });
  }
}

exports.scroll = function(req, res) {
  const page_size = 50;
  const entity = req.params.entity;
  const from_id = req.params.from;
  const scroll = req.params.scroll;
  if (scroll !== 'up' && scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');
  let condition = scroll === 'up'? `p._id < '${from_id}'` : `p._id > '${from_id}'`;
  let query = ` match (e:{_id:'${entity}'})-[:SELL|BRANDED]->(p:product)
                where ${condition}
                return distinct p._id as _id`;
  graphModel.query_objects(Product, query,
    `order by p._id desc`,
    0, page_size, function (err, products) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(products);
    })
};

//TODO: Sort by distance from user
exports.selling_businesses = function(req, res) {
  const page_size = 50;
  const code = req.params.barcode;
  const from_id = req.params.from;
  const scroll = req.params.scroll;
  if (scroll !== 'up' && scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');
  let condition = scroll === 'up'? `b._id < '${from_id}'` : `b._id > '${from_id}'`;
  let query = ` match (b:business)-[:SELL]->(p:product{code:'${code}'})
                where ${condition}
                return distinct b._id as _id`;
  graphModel.query_objects(Business, query,
    `order by b._id desc`,
    0, page_size, function (err, businesses) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(businesses);
    })
};

exports.eligible_products = function(req, res){
  //match (u:user)-[:SAVED]->(s:SavedInstance)-[:SAVE_OF]-(i:instance)-[:INSTANCE_OF]-(p:promotion)-[:PRODUCT]-(pr:product) return u,i,s,p,pr
  const page_size = 50;
  const from_id = req.params.from;
  const scroll = req.params.scroll;
  if (scroll !== 'up' && scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');
  let condition = scroll === 'up'? `b._id < '${from_id}'` : `b._id > '${from_id}'`;
  let query = ` match (u:user{_id:'${req.user._id}'}), (s:SavedInstance), (i:instance), (p:promotion), (pr:product)
                where ${condition} 
                AND (
                    (u)-[:SAVED]->(s)-[:SAVE_OF]-(i)-[:INSTANCE_OF]-(p)-[:PRODUCT]-(pr)
                  OR
                    (u)-[:ELIGIBLE]-(i)-[:INSTANCE_OF]-(p)-[:PRODUCT]-(pr) 
                ) 
                AND (i.start > timestamp() and i.end < timestamp())
                return pr._id as _id`;
  console.log(query);
  graphModel.query_objects(Product, query, '',
    0, page_size, function (err, products) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(products);
    })
};

exports.branded = function(req, res){
  const code = req.params.barcode;
  let query = ` (p:product{code:'${code}'})-[:BRANDED]->(b:brand)
                return b._id as _id`;
  graphModel.query_objects(Business, query, '',
    0, 1, function (err, businesses) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(businesses && businesses.length? businesses[0] : {});
    })
};


//TODO: Sort by distance from user
exports.business_selling_brand = function(req, res){
  const page_size = 50;
  const brand = req.params.brand;
  const from_id = req.params.from;
  const scroll = req.params.scroll;
  if (scroll !== 'up' && scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');
  let condition = scroll === 'up'? `b._id < '${from_id}'` : `b._id > '${from_id}'`;
  let query = ` match match (b:business)-[:SELL]->(p:product)-[:BRANDED]->(b:brand{_id: '${brand}'})
                where ${condition}
                return b._id as _id`;
  graphModel.query_objects(Business, query, '',
    0, page_size, function (err, businesses) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(businesses && businesses.length? businesses[0] : {});
    })
};


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
      costumeBarcode: product.costumeBarcode,
      SKU: product.SKU,
      retail_price: product.retail_price
    }, function (err, g_product) {
      if (err)
        return handleError(res, err);
      graphModel.relate_ids(g_product._id, 'CREATED_BY', req.user._id);
      if(product.barcode)
        handleBarcode(product);
      handleEntities(product, g_product);
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
