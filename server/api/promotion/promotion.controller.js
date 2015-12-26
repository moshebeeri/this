'use strict';

var _ = require('lodash');
var Promotion = require('./promotion.model');

var model = require('seraph-model');

var randomstring = require('randomstring');
var logger = require('../../components/logger');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('promotion');

exports.server_time = function(req, res) {
  return res.json(200, new Date().toString());
};

// Get list of promotions
exports.index = function(req, res) {
  Promotion.find(function (err, promotions) {
    if(err) { return handleError(res, err); }
    return res.json(200, promotions);
  });
};

// Get a single promotion
exports.show = function(req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if(err) { return handleError(res, err); }
    if(!promotion) { return res.send(404); }
    return res.json(promotion);
  });
};

// Creates a new promotion in the DB.
exports.create = function(req, res) {
  Promotion.create(req.body, function(err, promotion) {
    logger.info("Promotion.created : " + promotion._id);
    if(err) { return handleError(res, err); }
    logger.info("JSON.stringify=" + JSON.stringify(promotion, ["creator","name", "_id"]));
    graphModel.reflect(promotion, function(err) {
      if (err) { return handleError(res, err); }
    });
    return res.json(201, promotion);
  });
};

// Updates an existing promotion in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) { return handleError(res, err); }
    if(!promotion) { return res.send(404); }
    var updated = _.merge(promotion, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, promotion);
    });
  });
};

// Deletes a promotion from the DB.
exports.destroy = function(req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if(err) { return handleError(res, err); }
    if(!promotion) { return res.send(404); }
    promotion.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

//'/realize/:id'
exports.realize = function(req, res){
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) { return handleError(res, err); }
    if(!promotion) { return res.send(404);}
    //var updated = _.merge(promotion, req.body);
    promotion.realize_code = randomstring.generate({length:8,charset:'numeric'});
    promotion.realize_time = new Date();
    promotion.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, promotion);
    });
  });
}

//'/use/:id'
exports.use = function(req, res){
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) { return handleError(res, err); }
    if(!promotion) { return res.send(404);}
    //var updated = _.merge(promotion, req.body);
    promotion.realize_code = randomstring.generate({length:8,charset:'numeric'});
    promotion.realize_time = new Date();
    promotion.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, promotion);
    });
  });
}


function handleError(res, err) {
  return res.send(500, err);
}
