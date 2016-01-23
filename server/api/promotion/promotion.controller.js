'use strict';

var _ = require('lodash');
var Promotion = require('./promotion.model');

var model = require('seraph-model');

var randomstring = require('randomstring');
var logger = require('../../components/logger').createLogger();
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('promotion');
var utils = require('../../components/utils').createUtils();
var util = require('util');

exports.server_time = function(req, res) {
  return res.json(200, new Date().toString());
};


exports.initialize = function(req, res) {
  var PromotionType = graphTools.createGraphModel('PromotionType');
  PromotionType.model.setUniqueKey('PromotionType', true);
  var typEnum = Promotion.schema.path('type').enumValues;
    typEnum.forEach(function(typeStr){
    PromotionType.save({PromotionType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("PromotionType " + JSON.stringify(obj) + "created");
    });
  });
  var SocialType = graphTools.createGraphModel('SocialType');
  SocialType.model.setUniqueKey('SocialType', true);
  var socialEnum = Promotion.schema.path('social').enumValues;
    socialEnum.forEach(function(typeStr){
    SocialType.save({SocialType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("SocialType " + JSON.stringify(obj) + " created");
    });
  });
  return res.json(200, { type: typEnum, social: socialEnum });
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

function to_graph(promotion){
  return {
    _id : promotion._id,
    lat: promotion.location.lat,
    lng: promotion.location.lng,
    created: promotion.created,
    report: promotion.report,
    system_report: promotion.system_report
  }
}

// Creates a new promotion in the DB.
var relateTypes = function (promotion) {
  var db = graphModel.db();
  var query = util.format(" MATCH (promotion), (type:PromotionType{PromotionType:'%s'}) \
                            WHERE  id(promotion)=%d \
                            CREATE (promotion)-[:PROMOTION_TYPE]->(type) ", promotion.type, promotion.gid );
  console.log(query);
  db.query(query, function(err) {
    if (err) { logger.error(err.message); }
  });

  if(utils.defined(promotion.social)) {
    query = util.format(" MATCH (promotion), (type:SocialType{SocialType:'%s'}) \
                            WHERE  id(promotion)=%d \
                            CREATE (promotion)-[:SOCIAL_TYPE]->(type) ", promotion.social, promotion.gid );
    console.log(query);
    db.query(query, function (err) {
      if (err) { logger.error(err.message); }
    });
  }
};

exports.create = function(req, res) {
  Promotion.create(req.body, function(err, promotion) {
    //logger.info("Promotion.created : " + promotion._id);
    if(err) { return handleError(res, err); }
    //logger.info("JSON.stringify=" + JSON.stringify(promotion, ["creator","name", "_id"]));
    graphModel.reflect(promotion, to_graph(promotion), function(err, promotion) {
      if (err) { return handleError(res, err); }
      //create relationships
      if(promotion.report)
        graphModel.relate_ids(promotion._id, 'REPORTED_BY', req.body._id);
      if(utils.defined(promotion.mall))
        graphModel.relate_ids(promotion._id, 'MALL_PROMOTION', promotion.mall);
      if(utils.defined(promotion.shopping_chain))
        graphModel.relate_ids(promotion._id, 'CHAIN_PROMOTION', promotion.shopping_chain);
      if(utils.defined(promotion.business))
        graphModel.relate_ids(promotion._id, 'BUSINESS_PROMOTION', promotion.business);
      relateTypes(promotion);
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
};

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
};


function handleError(res, err) {
  return res.send(500, err);
}
