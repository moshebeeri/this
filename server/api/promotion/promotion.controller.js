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
    lat: promotion.location.lat,
    lon: promotion.location.lng,
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
      promotion.location = {
        lat: promotion.mall.location.lat,
        lng: promotion.mall.location.lng
      };
      promotion.mall = promotion.mall._id;
      callback(null, promotion)
    });
  else if (utils.defined(promotion.business))
    Promotion.populate(promotion, {path: 'business', model: 'Business'}, function (err, promotion) {
      if (err) return logger.error('failed to populate location ', err);
      promotion.location = {
        lat: promotion.business.location.lat,
        lng: promotion.business.location.lng
      };
      promotion.business = promotion.business._id;
      callback(null, promotion)
    });
};

exports.create = function (req, res) {
  Promotion.create(req.body, function (err, promotion) {
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
        if (utils.defined(promotion.business))
          promotionGraphModel.relate_ids(promotion._id, 'BUSINESS_PROMOTION', promotion.business);
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

//'/realize/:id'
exports.realize = function (req, res) {
  Promotion.findById(req.params.id, function (err, promotion) {
    if (err) {
      return handleError(res, err);
    }
    if (!promotion) {
      return res.send(404);
    }
    var realize_code = randomstring.generate({length: 8, charset: 'numeric'});
    var realize_time = new Date();
    instanceGraphModel.save({
      _id: promotion._id,
      gid: promotion._id,
      code: realize_code,
      time: realize_time
    }, function (err, instance) {
      if (err) {
        var err_msg = 'error saving promotion instance ' + err.message;
        logger.error(err_msg);
        return res.json(404, err_msg);
      }
      //instanceGraphModel.relate(instance.id, 'INSTANCE_OF', promotion.gid, {by: req.user._id});
      //promotionGraphModel.relate_ids(req.user._id, 'REALIZE', req.params.id, {timestamp: Date.now()});
      promotion.realize_code = instance.realize_code;
      promotion.realize_time = instance.realize_time;
      promotion.realize_gid = instance.realize_gid;
      return res.json(200, promotion);
    });
  });
};

//'/use/:id/:realize_code/:realize_gid/:sale_point_code'
//TODO: add validation of sale_point_code
//TODO: mark instance as used
exports.use = function (req, res) {
  promotionGraphModel.relate_ids(req.user._id, 'USE', req.params.id, {timestamp: Date.now()});
  return res.json(200, promotion);
};

function handleError(res, err) {
  return res.status(500).send(err)
}
