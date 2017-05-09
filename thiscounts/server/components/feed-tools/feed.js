"use strict";

var _ = require('lodash');
var async = require('async');
var utils = require('../utils').createUtils();

var logger = require('../logger').createLogger();
var graphTools = require('../graph-tools');
var graphModel = graphTools.createGraphModel('user');


exports.generate = function(msg) {
  return "generated " + msg;
};

function handleError(res, err) {
  return res.send(500, err);
}

exports.fetch_feed = function(userId, query_builder, Model, res) {
  //http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
  query_builder
    .populate({path: 'user',
                select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'})
    .populate({path: 'activity'})
    .exec(function (err, feeds) {
      if (err) {
        return handleError(res, err);
      }

      function populate_promotion(feeds, callback) {
        Model.populate(feeds, {path: 'activity.promotion', model: 'Promotion'}, callback);
      }

      function populate_product(feeds, callback) {
        Model.populate(feeds, {path: 'activity.product', model: 'Product'}, callback);
      }

      function populate_user(feeds, callback) {
        Model.populate(feeds, {
          path: 'activity.user',
          select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider',
          model: 'User'
        }, callback);
      }

      function populate_business(feeds, callback) {
        Model.populate(feeds, {path: 'activity.business', model: 'Business'}, callback);
      }

      function populate_mall(feeds, callback) {
        Model.populate(feeds, {path: 'activity.mall', model: 'Mall'}, callback);
      }

      function populate_chain(feeds, callback) {
        Model.populate(feeds, {path: 'activity.chain', model: 'ShoppingChain'}, callback);
      }

      function populate_actor_user(feeds, callback) {
        Model.populate(feeds, {
          path: 'activity.actor_user',
          select: '-salt -hashedPassword -gid -role -__v -email -sms_verified -sms_code -provider',
          model: 'User'
        }, function(err, actor_user){
          if(err) return callback(err);
          graphModel.query_ids_relation(userId, 'FOLLOW', actor_user._id, 'nick', function(err, nick){
            if(err || !utils.defined(nick))
              actor_user.name = actor_user.phone;
            actor_user.name = nick;
            callback(null,actor_user);
          })

        });
      }

      function populate_actor_business(feeds, callback) {
        Model.populate(feeds, {path: 'activity.actor_business', model: 'Business'}, callback);
      }

      function populate_actor_mall(feeds, callback) {
        Model.populate(feeds, {path: 'activity.actor_mall', model: 'Mall'}, callback);
      }

      function populate_actor_chain(feeds, callback) {
        Model.populate(feeds, {path: 'activity.actor_chain', model: 'ShoppingChain'}, callback);
      }

      async.waterfall([
        async.apply(populate_promotion, feeds),
        populate_product        ,
        populate_user           ,
        populate_business       ,
        populate_mall           ,
        populate_chain          ,
        populate_actor_user     ,
        populate_actor_business ,
        populate_actor_mall     ,
        populate_actor_chain

      ], function (err, feeds) {
        if (err) return res.status(500).json(err);
        update_states(feeds, function(err, feeds){
          if (err) return res.status(500).json(err);
          return res.status(200).json(feeds);
        });
      });
    });
};

exports.fetch_social_state = function(query_builder, userId, type, res) {
  function update_state_by_type(object, callback) {
    switch(type){
      case 'promotion':
        promotion_state(userId, object, callback);
        break;
      case 'product':
        product_state(userId, object, callback);
        break;
      case 'user':
        user_state(userId, object, callback);
        break;
      case 'business':
        business_state(userId, object, callback);
        break;
      case 'mall':
        mall_state(userId, object, callback);
        break;
      case 'chain':
        chain_state(userId, object, callback);
        break;
    }
  }
  query_builder
  .exec(function (err, types) {
    if (err) return res.status(500).json(err);
    async.each(types, update_state_by_type, function(err){
      if(err) callback(err, null);
      else callback(null, types)
    });
  })
};

//see http://www.markhneedham.com/blog/2013/02/24/neo4jcypher-combining-count-and-collect-in-one-query/
//WOW !!! MATCH (me{_id:'56bb06e0875e4eca72774728'})-[f:FOLLOW]->(followers) with distinct(followers) limit 2 return collect(followers), count(followers)
function social_state(user_id, item_id, callback) {
  //http://stackoverflow.com/questions/24097031/cypher-returning-boolean-after-checking-whether-relationship-exist-between-two-n
  //MATCH (n:Node {id: {parameter1}})-[r:someType]-(m:Node {id: {parameter2}}) RETURN SIGN(COUNT(r))

  //query = util.format("MATCH (p {_id: '%s'})-[:FOLLOW]->(followers) return COLLECT(followers) as followers, COUNT(followers) as followers_count",item_id);
  //query = util.format("MATCH (p {_id: '%s'})-[:SHARED]->(items) return COLLECT(followers) as followers, COUNT(items) as items",item_id);
  //query = util.format("MATCH (u {_id: '%s'})-[:OWNS]->(biz) return biz.name as name, biz._id as _id, ",item_id);

//see http://stackoverflow.com/questions/13408111/neo4j-cypher-using-limit-and-collect-or-using-limit-twice-in-the-same-query
//  q="   START me=node:node_auto_index(UserIdentifier='USER0')                                   \
//        MATCH me-[rels:FOLLOWS*0..1]-myfriend-[:POSTED*]-statusupdates<-[r?:LIKE]-likers         \
//        WITH distinct likers                                                                     \
//      // you can also order by something here, if you want.                                      \
//        LIMIT 6                                                                                  \
//        START me=node:node_auto_index(UserIdentifier='USER0')                                    \
//      // at this point, likers is already bound, so it's limited to the 6                        \
//        MATCH me-[rels:FOLLOWS*0..1]-myfriend-[:POSTED*]-statusupdates<-[r?:LIKE]-likers         \
//        RETURN distinct statusupdates, likers, myfriend                                          \
//        ORDER BY statusupdates.postTime                                                          \
//        LIMIT 25;"

  async.parallel({
      like: function (callback) {
        graphModel.is_related_ids(user_id, 'LIKE', item_id, callback);
      },
      share: function (callback) {
        graphModel.is_related_ids(user_id, 'SHARE', item_id, callback);
      },
      follow: function (callback) {
        graphModel.is_related_ids(user_id, 'FOLLOW', item_id, callback);
      },
      use: function (callback) {
        //TODO: check instance (promotion)<-[INSTANCE]-(instance)<-[USE]-(user)
        graphModel.is_related_ids(user_id, 'USE', item_id, callback);
      },
      likes: function (callback) {
        graphModel.count_in_rel_id('LIKE', item_id, callback);
      },
      shares: function (callback) {
        graphModel.count_in_rel_id('SHARE', item_id, callback);
      },
      usages: function (callback) {
        graphModel.count_in_rel_id('USE', item_id, callback);
      }
    },
    function (err, state) {
      if (err)
        callback(err, null);
      else
        callback(null, state);
    });
}

function promotion_state(user_id, promotion, callback) {
  social_state(user_id, promotion._id, function(err, social_state){
    if(err) {return callback(err, null);}
    promotion.social_state = social_state;
    callback(null, promotion);
    //TODO: use it when reimplementing promotion instances
    // graphModel.promotion_instance_id(user_id, promotion, function(err, instance){
    //   //instanceGraphModel.relate(instance.id, 'INSTANCE_OF', promotion.gid, {by: req.user._id});
    //   //graphModel.relate_ids(req.user._id, 'REALIZE', req.params.id, {timestamp: Date.now()});
    //   promotion.realize_code = instance.realize_code;
    //   promotion.save_time = instance.save_time;
    //   promotion.realize_gid  = instance.realize_gid;
    //   callback(null, promotion);
    // });
  });
}

function product_state(user_id, product, callback) {
  social_state(user_id, product._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    product.social_state = social_state;
    callback(null, product);
  });
}

function user_state(user_id, user, callback) {
  social_state(user_id, user._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    user.social_state = social_state;
    callback(null, user);

  });
}

function business_state(user_id, business, callback) {
  social_state(user_id, business._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    business.social_state = social_state;
    callback(null, business);
  });
}

function mall_state(user_id, mall, callback) {
  social_state(user_id, mall._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    mall.social_state = social_state;
    callback(null, mall);
  });
}

function chain_state(user_id, chain) {
  social_state(user_id, chain._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    chain.social_state = social_state;
    callback(null, chain);
  });
}

function update_states(feeds, callback) {
  async.each(feeds, update_state, function(err){
    if(err) callback(err, null);
    else callback(null, feeds)
  });

}

function update_state(feed, callback) {
  var activity = feed.activity;
  var user = feed.user;
  async.parallel({
      promotion: function (callback) {
        if (utils.defined(activity.promotion))
          promotion_state(user._id, activity.promotion, callback);
        else
          callback(null, null);
      },
      product: function (callback) {
        if (utils.defined(activity.product))
          product_state(user._id, activity.product, callback);
        else
          callback(null, null);
      },
      user: function (callback) {
        if (utils.defined(activity.user))
          user_state(user._id, activity.user, callback);
        else
          callback(null, null);
      },
      business: function (callback) {
        if (utils.defined(activity.business))
          business_state(user._id, activity.business, callback);
        else
          callback(null, null);
      },
      mall: function (callback) {
        if (utils.defined(activity.mall))
          mall_state(user._id, activity.mall, callback);
        else
          callback(null, null);
      },
      chain: function (callback) {
        if (utils.defined(activity.chain))
          chain_state(user._id, activity.chain, callback);
        else
          callback(null, null);
      },
      actor_user: function (callback) {
        if (utils.defined(activity.actor_user))
          user_state(user._id, activity.actor_user, callback);
        else
          callback(null, null);
      },
      actor_business: function (callback) {
        if (utils.defined(activity.actor_business))
          business_state(user._id, activity.actor_business, callback);
        else
          callback(null, null);
      },
      actor_mall: function (callback) {
        if (utils.defined(activity.actor_mall))
          mall_state(user._id, activity.actor_mall, callback);
        else
          callback(null, null);
      },
      actor_chain: function (callback) {
        if (utils.defined(activity.actor_chain))
          chain_state(user._id, activity.actor_chain, callback);
        else
          callback(null, null);
      }
    },
    function (err, states) {
      if(err){ return callback(err, null) }
      if (states['promotion'] != null)
        activity.promotion = states['promotion'];
      if (states['product'] != null)
        activity.product = states['product'];
      if (states['user'] != null)
        activity.user = states['user'];
      if (states['business'] != null)
        activity.business = states['business'];
      if (states['mall'] != null)
        activity.mall = states['mall'];
      if (states['chain'] != null)
        activity.chain = states['chain'];
      if (states['actor_user'] != null)
        activity.actor_user = states['actor_user'];
      if (states['actor_business'] != null)
        activity.actor_business = states['actor_business'];
      if (states['actor_mall'] != null)
        activity.actor_mall = states['actor_mall'];
      if (states['actor_chain'] != null)
        activity.actor_chain = states['actor_chain'];

      callback(null, feed)
    });
}

//var populate_all = async.compose(pupulate( { path: 'activity.actor_user', model: 'User' }, feeds), add1);
//async.parallel([
//  { path: 'activity.promotion'      , model: 'Promotion'    },
//  { path: 'activity.user'           , model: 'User'         },
//  { path: 'activity.business'       , model: 'Business'     },
//  { path: 'activity.mall'           , model: 'Mall'         },
//  { path: 'activity.chain'          , model: 'SoppingChain' },
//  { path: 'activity.actor_user'     , model: 'User'         },
//  { path: 'activity.actor_business' , model: 'Business'     },
//  { path: 'activity.actor_mall'     , model: 'Mall'         },
//  { path: 'activity.actor_chain'    , model: 'SoppingChain' }
//];

//var options = {path: 'activity.actor_user', model: 'User'};
//Feed.populate(feeds, options, function (err, feeds) {
//  return res.status(200).json(feeds);
//});
//populate: { path: 'promotion user business mall chain actor_user actor_business actor_mall actor_chain' }

