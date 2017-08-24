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
let instance = require('../../components/instance');
let MongodbSearch = require('../../components/mongo-search');

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

exports.search = MongodbSearch.create(Promotion);

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
    system_report: promotion.system_report,
    validate_barcode: promotion.validate_barcode
  }
}

// Creates a new promotion in the DB.
let relateTypes = function (promotion) {
  let db = promotionGraphModel.db();
  let query =  `MATCH (promotion), (type:PromotionType{PromotionType:'${promotion.type}'}) 
                WHERE  id(promotion)=${promotion.gid} 
                CREATE (promotion)-[:PROMOTION_TYPE]->(type) `;
  db.query(query, function (err) {
    if (err) {
      logger.error(err.message);
    }
  });

  if (utils.defined(promotion.social)) {
    query =  `MATCH (promotion), (type:SocialType{SocialType:'${promotion.social}'}) 
              WHERE  id(promotion)=${promotion.gid} 
              CREATE (promotion)-[:SOCIAL_TYPE]->(type)`;
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
      if(!promotion.entity.mall) return callback(new Error('Mall not found error'));
      promotion.mall = promotion.entity.mall._id;
      spatial.location_to_point(promotion);
      callback(null, promotion)
    });
  else if (utils.defined(promotion.entity.business))
    Promotion.populate(promotion, {path: 'entity.business', model: 'Business'}, function (err, promotion) {
      if (err) return callback(err);
      if(!promotion.entity.business) return callback(new Error('Business not found error'));
      promotion.location = promotion.entity.business.location;
      promotion.business = promotion.entity.business._id;
      spatial.location_to_point(promotion);
      callback(null, promotion)
    });

};

exports.test_me = function (req, res) {
  let distributor = require('../../components/distributor');
  let spreads = distributor.distributePromotions(20, 40, 5, 30);
  return res.status(201).json(spreads);
};

function applyToGroups(promotion, instances){
  instances.forEach(instance => {
    let groups;
    if (instance && promotion && (groups = promotion.distribution.groups)) {
      groups.forEach(group =>
        instance_group_activity(instance, group._id))
    }
  });
}


function applyToFollowingGroups(promotion, instances) {
  instances.forEach(instance => {
    let business;
    if (instance && promotion && (business = promotion.entity.business)) {
      if (instance.variation === 'SINGLE') {
        let query = instanceGraphModel.related_type_id_dir_query(business._id, 'FOLLOW', 'group', 'in', 0, instance.quantity);
        instanceGraphModel.query(query, function (err, groups_ids) {
          if (err) return console.error(err); //return callback(err);
          groups_ids.forEach(_id =>
            instance_group_activity(instance, _id))
        })
      }
    }
  });
}

//see https://neo4j.com/blog/real-time-recommendation-engine-data-science/
function applyToFollowingUsers(promotion, instances, callback) {
  instances.forEach(instance => {
    //instance_eligible_activity(instance);
    spatial.userLocationWithinDistance({
      longitude: instance.location.lng,
      latitude: instance.location.lat
    }, 30, 0, instance.quantity, function (err, results) {
      if (err) return console.error(err);
      results.forEach(user => {
        user_instance_eligible_activity(user._id, instance);
      })
    });
  })
}

function applyToFollowing(promotion, instances) {
  applyToFollowingGroups(promotion, instances);
  applyToFollowingUsers(promotion, instances);
}

function create_promotion(promotion, callback) {
  //TODO: Convert to address location
  set_promotion_location(promotion, function (err, promotion) {
    if (err) return callback(err, null);
    Promotion.create(promotion, function (err, promotion) {
      if (err) return callback(err, null);
      promotionGraphModel.reflect(promotion, to_graph(promotion), function (err, promotion) {
        if (err) return callback(err, null);
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

        if (utils.defined(promotion.campaign_id))
          promotionGraphModel.relate_ids(promotion.campaign_id, 'CAMPAIGN_PROMOTION', promotion._id);

        if (utils.defined(promotion.condition.product))
          promotionGraphModel.relate_ids(promotion._id, 'PRODUCT', promotion.condition.product);

        relateTypes(promotion);
        //promotion_created_activity(promotion);
        spatial.add2index(promotion.gid, function (err, result) {
          if (err) return callback(err, null);

          instance.cratePromotionInstances(promotion, function (err, instances) {
            if (err) return callback(err, null);
            if(promotion.distribution.business) {
              applyToFollowing(promotion, instances);
            }else if(promotion.distribution.groups && promotion.distribution.groups.length > 0){
              applyToGroups(promotion, instances);
            }
          });
        });
      });
      callback(null, promotion);
    });
  });
}

exports.create = function (req, res) {
  let promotion = req.body;
  promotion.creator = req.user._id;
  create_promotion(promotion, function (err, promotion) {
    if (err) return handleError(res, err);
    return res.status(201).json(promotion);
  })
};

exports.create_campaign = function (req, res) {
  let promotion = req.body;
  let campaign = req.body;
  promotion.creator = req.user._id;

  create_promotion(promotion, function (err, promotion) {
    if (err) return handleError(res, err);
    campaign.promotions = [promotion];
    campaign.creator = req.user._id;
    campaign.name = promotion.name;
    campaign_controller.create_campaign(campaign, function (err, campaign) {
      campaign.promotions.forEach((promotion) => {
        promotionGraphModel.relate_ids(campaign._id, 'CAMPAIGN_PROMOTION', promotion._id);
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
  if (utils.defined(promotion.entity.mall))
    act.actor_mall = promotion.entity.mall._id;
  if (utils.defined(promotion.entity.shopping_chain))
    act.actor_chain = promotion.entity.shopping_chain._id;
  if (utils.defined(promotion.entity.business))
    act.actor_business = promotion.entity.business._id;

  activity.create(act);
}

function instance_eligible_activity(instance) {
  if (utils.defined(instance.promotion.entity.business)) {
    let act = {
      instance: instance._id,
      promotion: instance.promotion._id,
      action: "eligible"
    };
    act.actor_business = instance.promotion.entity.business;
    activity.create(act);
  }
}

function user_instance_eligible_activity(userId, instance){
  if (utils.defined(instance.promotion.entity.business)) {
    let act = {
      instance: instance._id,
      promotion: instance.promotion._id,
      ids: [userId],
      action: "eligible"
    };
    act.actor_business = instance.promotion.entity.business;
    activity.create(act);
  }
}


function instance_group_activity(instance, group_id) {
  activity.create({
    instance: instance._id,
    promotion: instance.promotion._id,
    action: "instance",
    ids: [group_id],
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

exports.test = function (req, res) {
  promotionGraphModel.query("MATCH (p:promotion) return p limit 5", function (err, promotions) {
    return res.json(200, promotions);
  })
};

exports.campaign_promotions = function (req, res) {
  let userID = req.user._id;
  let businessID = req.params.business_id;
  let campaignID = req.params.campaign_id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})-[r:ROLE{name:"OWNS"}]->
      (b:business {_id:'${businessID}'})-[bc:BUSINESS_CAMPAIGN]->
      (c:campaign {_id:'${campaignID}'})-[cp:CAMPAIGN_PROMOTION]->(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', 0, 1000,
    function (err, promotions) {
      if (err) {
        return handleError(res, err)
      }
      if (!promotions) {
        return res.send(404);
      }
      return res.status(200).json(promotions);
    });
};

exports.business_promotions = function (req, res) {
  let businessID = req.params.business_id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (b:business {_id:'${businessID}'})<-[:BUSINESS_PROMOTION]-(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', 0, 1000, function (err, promotions) {
      if (err) {
        return handleError(res, err)
      }
      if (!promotions) {
        return res.send(404);
      }
      return res.status(200).json(promotions);
    });
};

exports.user_business = function (req, res) {
  let userID = req.user._id;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})-[r:ROLE{name:"OWNS"}]->(b:business)<-[]-(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', 0, 1000, function (err, promotions) {
      if (err) return handleError(res, err);
      return res.status(200).json(promotions);
    });
};

exports.user_promotions = function (req, res) {
  let userID = req.user._id;
  let skip = req.params.skip;
  let limit = req.params.limit;

  promotionGraphModel.query_objects(Promotion,
    `MATCH (u:user {_id:'${userID}'})<-[r:CREATED_BY]-(p:promotion) RETURN p._id as _id`,
    'order by p.created DESC', skip, limit, function (err, promotions) {
      if (err) return handleError(res, err);
      return res.status(200).json(promotions);
    });
};

function handleError(res, err) {
  return res.status(500).send(err)
}
