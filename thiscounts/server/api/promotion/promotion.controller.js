'use strict';

let _ = require('lodash');
let async = require('async');

let Promotion = require('./promotion.model');
let campaign_controller = require('../campaign/campaign.controller');

let model = require('seraph-model');

let randomstring = require('randomstring');
let logger = require('../../components/logger').createLogger();
let graphTools = require('../../components/graph-tools');
let promotionGraphModel = graphTools.createGraphModel('promotion');
let instanceGraphModel = graphTools.createGraphModel('instance');
let utils = require('../../components/utils').createUtils();
let activity = require('../../components/activity').createActivity();
let util = require('util');
let spatial = require('../../components/spatial').createSpatial();

/*
 exports.server_time = function (req, res) {
 return res.json(200, new Date().toString());
 };



 exports.initialize = function (req, res) {
 let PromotionType = graphTools.createGraphModel('PromotionType');
 Promotion Type.model.setUniqueKey('PromotionType', true);
 let typEnum = Promotion.schema.path('type').enumValues;
 typEnum.forEach(function (typeStr) {
 PromotionType.save({PromotionType: typeStr}, function (err, obj) {
 if (err) console.log("failed " + err.message);
 else console.log("PromotionType " + JSON.stringify(obj) + "created");
 });
 });
 let SocialType = graphTools.createGraphModel('SocialType');
 SocialType.model.setUniqueKey('SocialType', true);
 let socialEnum = Promotion.schema.path('social').enumValues;
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
    lat: promotion.location.lat,
    lon: promotion.location.lng,
    created: promotion.created,
    report: promotion.report,
    system_report: promotion.system_report
  }
}

// Creates a new promotion in the DB.
let relateTypes = function (promotion) {
  let db = promotionGraphModel.db();
  let query = util.format(" MATCH (promotion), (type:PromotionType{PromotionType:'%s'}) \
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

let set_promotion_location = function (promotion, callback) {
  if (!utils.defined(promotion.entity))
    callback(null, promotion);
  if (!(utils.defined(promotion.entity.mall) || utils.defined(promotion.entity.business)))
    callback(null, promotion);
  else if (utils.defined(promotion.entity.mall))
    Promotion.populate(promotion, {path: 'entity.mall', model: 'Mall'}, function (err, promotion) {
      if (err) return logger.error('failed to populate location ', err);
      promotion.location = promotion.entity.mall.location;
      promotion.mall = promotion.entity.mall._id;
      spatial.location_to_point(promotion);
      callback(null, promotion)
    });
  else if (utils.defined(promotion.entity.business))
    Promotion.populate(promotion, {path: 'entity.business', model: 'Business'}, function (err, promotion) {
      if (err) return logger.error('failed to populate location ', err);
      promotion.location = promotion.entity.business.location;
      promotion.business = promotion.entity.business._id;
      spatial.location_to_point(promotion);
      callback(null, promotion)
    });

};

function create_promotion(promotion, callback) {
  //TODO: Convert to address location
  console.log(JSON.stringify(promotion));

  set_promotion_location(promotion, function (err, promotion) {
    if (err) return callback(err, null);
    Promotion.create(promotion, function (err, promotion) {
      promotionGraphModel.reflect(promotion, to_graph(promotion), function (err, promotion) {
        if (err) return callback(err, null);
        console.log(`creating relationships (${promotion._id})-[CREATED_BY]->(${promotion.creator})`);
        //create relationships
        promotionGraphModel.relate_ids(promotion._id, 'CREATED_BY', promotion.creator);

        if (promotion.report)
          promotionGraphModel.relate_ids(promotion._id, 'REPORTED_BY', promotion.creator);

        if (utils.defined(promotion.entity.mall))
          promotionGraphModel.relate_ids(promotion._id, 'MALL_PROMOTION', promotion.entity.mall._id);

        if (utils.defined(promotion.entity.shopping_chain))
          promotionGraphModel.relate_ids(promotion._id, 'CHAIN_PROMOTION', promotion.entity.shopping_chain._id);

        if (utils.defined(promotion.entity.business))
          promotionGraphModel.relate_ids(promotion._id, 'BUSINESS_PROMOTION', promotion.entity.business._id);

        if (utils.defined(promotion.campaign_id)) {
          promotionGraphModel.relate_ids(promotion.campaign_id, 'CAMPAIGN_PROMOTION', promotion._id);
        }
        relateTypes(promotion);
        promotion_created_activity(promotion);
        spatial.add2index(promotion.gid, function (err, result) {
          if (err) return callback(err, null);
          else logger.info('object added to layer ' + result)
        });
      });
      callback(null, promotion);
    });
  });
}

exports.create = function (req, res) {
  let promotion = req.body;
  promotion.creator = req.user._id;
  create_promotion(promotion, function(err, promotion){
    if (err) return handleError(res, err);
    return res.json(201, promotion);
  })
};

exports.create_backup = function (req, res) {
  let promotion = req.body;
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
        if (err)
          return handleError(res, err);

        promotionGraphModel.relate_ids(promotion._id, 'CREATED_BY', promotion.creator);
        //create relationships
        if (promotion.report)
          promotionGraphModel.relate_ids(promotion._id, 'REPORTED_BY', req.body._id);
        if (utils.defined(promotion.mall))
          promotionGraphModel.relate_ids(promotion._id, 'MALL_PROMOTION', promotion.mall);
        if (utils.defined(promotion.shopping_chain))
          promotionGraphModel.relate_ids(promotion._id, 'CHAIN_PROMOTION', promotion.shopping_chain);
        if (utils.defined(promotion.business))
          promotionGraphModel.relate_ids(promotion._id, 'BUSINESS_PROMOTION', promotion.business);
        if (utils.defined(req.body["campaign_id"])) {
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

exports.create_campaign = function (req, res) {
  let promotion = req.body;
  let campaign = req.body;
  promotion.creator = req.user._id;

  create_promotion(promotion, function(err, promotion) {
    if (err) return handleError(res, err);
    campaign.promotions = [promotion._id];
    campaign.creator = req.user._id;
    campaign.name = promotion.name;
    campaign_controller.create_campaign(campaign, function (err, campaign) {
      campaign.promotions.forEach((promotion) => {
        promotionGraphModel.relate_ids(campaign._id, 'CAMPAIGN_PROMOTION', promotion);
      });
      if (err) return handleError(res, err);
      return res.status(201).json(campaign)
    })
  });
};

function promotion_created_activity(promotion) {
  let act = {
    promotion: promotion._id,
    action: "created"
  };
  if (promotion.report)
    act.actor_user = promotion.creator._id;
  if (utils.defined(promotion.entity.mall._id))
    act.actor_mall = promotion.entity.mall._id;
  if (utils.defined(promotion.entity.shopping_chain._id))
    act.actor_chain = promotion.entity.shopping_chain._id;
  if (utils.defined(promotion.entity.business._id))
    act.actor_business = promotion.entity.business._id;

  activity.create(act);
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
    let updated = _.merge(promotion, req.body);
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
    let realize_code = randomstring.generate({length: 8, charset: 'numeric'});
    let save_time = new Date();
    instanceGraphModel.save({
      _id: promotion._id,
      user: req.params.id,
      code: realize_code,
      used: false,
      time: save_time
    }, function (err, instance) {
      if (err) {
        let err_msg = 'error saving promotion instance ' + err.message;
        logger.error(err_msg);
        return res.json(404, err_msg);
      }
      instanceGraphModel.relate(instance.id, 'INSTANCE_OF', promotion.gid, {by: req.user._id});
      promotionGraphModel.relate_ids(req.user._id, 'SAVED', req.params.id, {timestamp: Date.now()});
      promotion.realize_code = instance.realize_code;
      promotion.save_time = instance.save_time;
      promotion.realize_gid = instance.gid;
      return res.json(200, promotion);
    });
  });
};

//'/realize/:id/:realize_code/:realize_gid/:sale_point_code'
//TODO: add validation of sale_point_code
exports.realize = function (req, res) {
  const query = util.format("MATCH (i:instance { _id:'{%s}', user:'{%s}'})", req.params.id, req.user._id);
  instanceGraphModel.query(query, function (err, instances) {
    if (err) return handleError(res, err);

    if (instances.length > 0)
      return res.status(500).send('multiple instances found');
    let instance = instances[0];
    if (instance.realize_code !== req.params.realize_code)
      return res.status(400).send('mismatch realize_code');
    if (instance.id !== req.params.realize_gid)
      return res.status(400).send('mismatch realize_gid');
    if (instance.used)
      return res.status(400).send('promotion already used');
    if (instance.user !== req.user._id)
      return res.status(400).send('user not related to this promotion instance');

    instance.used = true;
    instance.time = new Date();
    instanceGraphModel.save(instance, function (err, instance) {
      if (err) return handleError(res, err);
      //graphModel.unrelate_ids(req.user._id, 'SAVED', req.params.id);
      promotionGraphModel.relate_ids(req.user._id, 'REALIZED', req.params.id, {timestamp: Date.now()});
      return res.json(200, instance);
    })
  });
};

exports.test = function (req, res) {
  promotionGraphModel.query("MATCH (p:promotion) return p limit 5", function (err, promotions) {
    console.log(promotions.length);
    console.log(promotions[0]);
    return res.json(200, promotions);
  })
};

exports.campaign_promotions = function (req, res) {
  console.log("user campaign promotions");
  console.log("user: " + req.user._id);
  let userID = req.user._id;
  let businessID = req.params.business_id;
  let campaignID = req.params.campaign_id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})-[r:OWNS]->
      (b:business {_id:'${businessID}'})-[bc:BUSINESS_CAMPAIGN]->
      (c:campaign {_id:'${campaignID}'})-[cp:CAMPAIGN_PROMOTION]->(p:promotion) RETURN p`,
    'p.created DESC', 0, 1000,
    function (err, promotions) {
      if (err) {
        return handleError(res, err)
      }
      if (!promotions) {
        return res.send(404);
      }
      console.log(JSON.stringify(promotions));
      return res.status(200).json(promotions);
    });
};

exports.business_promotions = function (req, res) {
  console.log("business promotions");
  console.log("user: " + req.user._id);
  let userID = req.user._id;
  let businessID = req.params.business_id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})-[r:OWNS]->(b:business {_id:'${businessID}'})<-[]-(p:promotion) RETURN p`,
    'p.created DESC', 0, 1000, function (err, promotions) {
      if (err) {
        return handleError(res, err)
      }
      if (!promotions) {
        return res.send(404);
      }
      console.log(JSON.stringify(promotions));
      return res.status(200).json(promotions);
    });
};

exports.user_business = function (req, res) {
  let userID = req.user._id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})-[r:OWNS]->(b:business)<-[]-(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', 0, 1000, function (err, promotions) {
      if (err) return handleError(res, err);

      console.log(JSON.stringify(promotions));
      return res.status(200).json(promotions);
    });
};

exports.user_promotions = function (req, res) {
  let userID = req.user._id;
  let skip =  req.params.skip;
  let limit = req.params.limit;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})<-[r:CREATED_BY]-(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', skip, limit, function (err, promotions) {
      if (err) return handleError(res, err);

      console.log(JSON.stringify(promotions));
      return res.status(200).json(promotions);
    });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err)
}
