'use strict';

var _ = require('lodash');
var async = require('async');

var Promotion = require('./promotion.model');

var model = require('seraph-model');

var randomstring = require('randomstring');
var logger = require('../../components/logger').createLogger();
var graphTools = require('../../components/graph-tools');
var promotionGraphModel = graphTools.createGraphModel('promotion');
var instanceGraphModel = graphTools.createGraphModel('instance');
var utils = require('../../components/utils').createUtils();
var activity = require('../../components/activity').createActivity();
var util = require('util');
var spatial = require('../../components/spatial').createSpatial();

/*
exports.server_time = function (req, res) {
  return res.json(200, new Date().toString());
};



exports.initialize = function (req, res) {
  var PromotionType = graphTools.createGraphModel('PromotionType');
  PromotionType.model.setUniqueKey('PromotionType', true);
  var typEnum = Promotion.schema.path('type').enumValues;
  typEnum.forEach(function (typeStr) {
    PromotionType.save({PromotionType: typeStr}, function (err, obj) {
      if (err) console.log("failed " + err.message);
      else console.log("PromotionType " + JSON.stringify(obj) + "created");
    });
  });
  var SocialType = graphTools.createGraphModel('SocialType');
  SocialType.model.setUniqueKey('SocialType', true);
  var socialEnum = Promotion.schema.path('social').enumValues;
  socialEnum.forEach(function (typeStr) {
    SocialType.save({SocialType: typeStr}, function (err, obj) {
      if (err) console.log("failed " + err.message);
      else console.log("SocialType " + JSON.stringify(obj) + " created");
    });
  });
  return res.json(200, {type: typEnum, social: socialEnum});
};
*/



// Get list of promotions
exports.index = function (req, res) {
  Promotion.find(function (err, promotions) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, promotions);
  });
};

// Get a single promotion
exports.show = function (req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) {
      return handleError(res, err);
    }
    if (!promotion) {
      return res.send(404);
    }
    return res.json(promotion);
  });
};

function to_graph(promotion) {
  return {
    _id: promotion._id,
    //lat: promotion.location.lat,
    //lon: promotion.location.lng,
    created: promotion.created,
    report: promotion.report,
    system_report: promotion.system_report
  }
}

// Creates a new promotion in the DB.
var relateTypes = function (promotion) {
  var db = promotionGraphModel.db();
  var query = util.format(" MATCH (promotion), (type:PromotionType{PromotionType:'%s'}) \
                            WHERE  id(promotion)=%d \
                            CREATE (promotion)-[:PROMOTION_TYPE]->(type) ", promotion.type, promotion.gid);
  console.log(query);
  db.query(query, function (err) {
    if (err) {
      logger.error(err.message);
    }
  });

  if (utils.defined(promotion.social)) {
    query = util.format(" MATCH (promotion), (type:SocialType{SocialType:'%s'}) \
                            WHERE  id(promotion)=%d \
                            CREATE (promotion)-[:SOCIAL_TYPE]->(type) ", promotion.social, promotion.gid);
    console.log(query);
    db.query(query, function (err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
};

var set_promotion_location = function (promotion, callback) {
  if (!(utils.defined(promotion.mall) || utils.defined(promotion.business)))
    callback(null, promotion);
  else if (utils.defined(promotion.mall))
    Promotion.populate(promotion, {path: 'mall', model: 'Mall'}, function (err, promotion) {
      if (err) return logger.error('failed to populate location ', err);
      promotion.location = promotion.mall.location;
      promotion.mall = promotion.mall._id;
      callback(null, promotion)
    });
  else if (utils.defined(promotion.business))
    Promotion.populate(promotion, {path: 'business', model: 'Business'}, function (err, promotion) {
      if (err) return logger.error('failed to populate location ', err);
      promotion.location = promotion.business.location;
      promotion.business = promotion.business._id;
      callback(null, promotion)
    });
};

exports.create = function (req, res) {
  //TODO: where to set the gid? number/string?
  req.body.gid = Math.floor(Math.random() * 100000);
  var promotion = req.body;
  //TODO: Convert to address location
  console.log(JSON.stringify(promotion));
  spatial.location_to_point(promotion);
  Promotion.create(promotion, function (err, promotion) {
    //logger.info("Promotion.created : " + promotion._id);
    if (err) {
      return handleError(res, err);
    }
    //logger.info("JSON.stringify=" + JSON.stringify(promotion, ["creator","name", "_id"]));
    set_promotion_location(promotion, function (err, promotion) {

      promotionGraphModel.reflect(promotion, to_graph(promotion), function (err, promotion) {
        if (err) {
          return handleError(res, err);
        }
        //create relationships
        if (promotion.report)
          promotionGraphModel.relate_ids(promotion._id, 'REPORTED_BY', req.body._id);
        if (utils.defined(promotion.mall))
          promotionGraphModel.relate_ids(promotion._id, 'MALL_PROMOTION', promotion.mall);
        if (utils.defined(promotion.shopping_chain))
          promotionGraphModel.relate_ids(promotion._id, 'CHAIN_PROMOTION', promotion.shopping_chain);
        //if (utils.defined(promotion.business))
        //  promotionGraphModel.relate_ids(promotion._id, 'BUSINESS_PROMOTION', promotion.business);
        if(utils.defined(req.body["campaign_id"])){
          promotionGraphModel.relate_ids(req.body["campaign_id"], 'CAMPAIGN_PROMOTION', promotion._id);
        }
        relateTypes(promotion);
        promotion_created_activity(promotion);
        spatial.add2index(promotion.gid, function (err, result) {
          if (err) logger.error(err.message);
          else logger.info('object added to layer ' + result)
        });
      });
    });
    return res.json(201, promotion);
  });
};

function promotion_created_activity(promotion) {
  var act = {
    promotion: promotion._id,
    action: "created"
  };
  if (promotion.report)
    act.actor_user = promotion.creator;
  if (utils.defined(promotion.mall))
    act.actor_mall = promotion.creator;
  if (utils.defined(promotion.shopping_chain))
    act.actor_chain = promotion.creator;
  if (utils.defined(promotion.business))
    act.actor_business = promotion.creator;

  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });
}

// Updates an existing promotion in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) {
      return handleError(res, err);
    }
    if (!promotion) {
      return res.send(404);
    }
    var updated = _.merge(promotion, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, promotion);
    });
  });
};

// Deletes a promotion from the DB.
exports.destroy = function (req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) {
      return handleError(res, err);
    }
    if (!promotion) {
      return res.send(404);
    }
    promotion.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

//'/save/:id'
exports.save = function (req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) {
      return handleError(res, err);
    }
    if (!promotion) {
      return res.send(404);
    }
    var realize_code = randomstring.generate({length: 8, charset: 'numeric'});
    var save_time = new Date();
    instanceGraphModel.save({
      _id: promotion._id,
      user: req.params.id,
      gid: promotion._id,
      code: realize_code,
      used: false,
      time: save_time
    }, function (err, instance) {
      if (err) {
        var err_msg = 'error saving promotion instance ' + err.message;
        logger.error(err_msg);
        return res.json(404, err_msg);
      }
      instanceGraphModel.relate(instance.id, 'INSTANCE_OF', promotion.gid, {by: req.user._id});
      promotionGraphModel.relate_ids(req.user._id, 'SAVED', req.params.id, {timestamp: Date.now()});
      promotion.realize_code = instance.realize_code;
      promotion.save_time = instance.save_time;
      promotion.realize_gid = instance.realize_gid;
      return res.json(200, promotion);
    });
  });
};

//'/realize/:id/:realize_code/:realize_gid/:sale_point_code'
//TODO: add validation of sale_point_code
exports.realize = function (req, res) {
  var query = util.format("MATCH (i:instance { _id:'{%s}', user:'{%s}'})", req.params.id, req.user._id );
  instanceGraphModel.query(query, function(err, instances){
    if(err) return handleError(res, err);

    if(instances.length > 0 )
      return res.status(500).send('multiple instances found');
    var instance = instances[0];
    if(instance.realize_code != req.params.realize_code)
      return res.status(400).send('mismatch realize_code');
    if(instance.id != req.params.realize_gid)
      return res.status(400).send('mismatch realize_gid');
    if(instance.used)
      return res.status(400).send('promotion already used');
    if(instance.user != req.user._id)
      return res.status(400).send('user not related to this promotion instance');

    instance.used = true;
    instance.time = new Date();
    instanceGraphModel.save(instance, function(err, instance){
      if(err) return handleError(res, err);
      //graphModel.unrelate_ids(req.user._id, 'SAVED', req.params.id);
      promotionGraphModel.relate_ids(req.user._id, 'REALIZED', req.params.id, {timestamp: Date.now()});
      return res.json(200, instance);
    })
  });
};

exports.test = function (req, res) {
  promotionGraphModel.query("MATCH (p:promotion) return p limit 5", function(err, promotions){
    console.log(promotions.length);
    console.log(promotions[0]);
    return res.json(200, promotions);
  })
};

exports.campaign_promotions = function (req, res) {
  console.log("user_promotions");
  console.log("user: " + req.user._id);
  var userID = req.user._id;
  var businessID = req.params.business_id;
  var campaignID = req.params.campaign_id;
  console.log("MATCH (u:user {_id:'"+ userID +"'})-[r:OWNS]->(b:business {_id:'"+ businessID +"'})-[bc:BUSINESS_CAMPAIGN]->(c:campaign {_id:'"+ campaignID +"'})-[cp:CAMPAIGN_PROMOTION]->(p:promotion) RETURN p LIMIT 25");
  promotionGraphModel.query("MATCH (u:user {_id:'"+ userID +"'})-[r:OWNS]->(b:business {_id:'"+ businessID +"'})-[bc:BUSINESS_CAMPAIGN]->(c:campaign {_id:'"+ campaignID +"'})-[cp:CAMPAIGN_PROMOTION]->(p:promotion) RETURN p LIMIT 25", function(err, groups){
    if (err) {return handleError("13",res, err)}
    if(!groups) { return res.send(404); }
    console.log(JSON.stringify(groups));
    return res.status(200).json(groups);
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err)
}
