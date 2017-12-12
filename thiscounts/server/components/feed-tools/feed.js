"use strict";

const _ = require('lodash');
const async = require('async');
const utils = require('../utils').createUtils();

const logger = require('../logger').createLogger();
const graphTools = require('../graph-tools');
const graphModel = graphTools.createGraphModel('user');
const SortedArray = require('sorted-array');


exports.generate = function(msg) {
  return "generated " + msg;
};

function handleError(res, err) {
  return res.status(500).send(err);
}

exports.fetch_feed = function(userId, query_builder, Model, res) {
  //http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
  query_builder
    // .populate({path: 'user',
    //   select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'})
    // .populate({path: 'activity'})
    .exec(function (err, feeds) {
      if (err) return handleError(res, err);
      update_states(userId, feeds, function(err, feeds){
          if (err) {return res.status(500).json(err);}
          return res.status(200).json(feeds);
        });
      });
};

//MATCH (n:comment)<-[r:COMMENTED]-(p) RETURN n,p

//see http://www.markhneedham.com/blog/2013/02/24/neo4jcypher-combining-count-and-collect-in-one-query/
function social_state(user_id, item_id, callback) {

  async.parallel({
      saved: function (callback) {
        graphModel.is_related_saved_instance(user_id, 'SAVED', item_id, callback);
      },
      realized: function (callback) {
        graphModel.is_related_saved_instance(user_id, 'REALIZED', item_id, callback);
      },
      like: function (callback) {
        graphModel.is_related_ids(user_id, 'LIKE', item_id, callback);
      },
      share: function (callback) {
        graphModel.is_related_ids(user_id, 'SHARE', item_id, callback);
      },
      follow: function (callback) {
        graphModel.is_related_ids(user_id, 'FOLLOW', item_id, callback);
      },
      saves: function (callback) {
        graphModel.saved_instance_rel_count(item_id, 'SAVED', callback);
      },
      realizes: function (callback) {
        graphModel.saved_instance_rel_count(item_id, 'REALIZED', callback);
      },
      likes: function (callback) {
        graphModel.count_in_rel_id('LIKE', item_id, callback);
      },
      shares: function (callback) {
        graphModel.count_in_rel_id('SHARE', item_id, callback);
      },
      followers: function (callback) {
        graphModel.count_in_rel_id('FOLLOW', item_id, callback);
      },
      comments: function (callback) {
        graphModel.count_in_though(item_id, 'COMMENTED', 'INSTANCE_OF', callback);
      },
    },
    function (err, state) {
      if (err) {
        callback(err, null);
      }
      else {
        callback(null, state);
      }
    });
}

function promotion_state(user_id, promotion, callback) {
  social_state(user_id, promotion._id, function(err, social_state){
    if(err) {return callback(err, null);}
    promotion.social_state = social_state;
    callback(null, promotion);
  });
}

exports.promotion_state = function(user_id, promotion, callback) {
  return promotion_state(user_id, promotion, callback);
};

function instance_state(user_id, instance, callback){
  social_state(user_id, instance._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    instance.social_state = social_state;
    callback(null, instance);
  })
}

exports.post_state = function(user_id, post, callback) {
  return post_state(user_id, post, callback);
};

function post_state(user_id, post, callback){
  social_state(user_id, post._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    post.social_state = social_state;
    callback(null, post);
  })
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

exports.user_state = function(user_id, user, callback) {
  return user_state(user_id, user, callback);
};

exports.business_state = function(user_id, business, callback) {
  return business_state(user_id, business, callback);
};

function group_state(user_id, group, callback) {
  social_state(user_id, group._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    group.social_state = social_state;
    callback(null, group);
  });
}

exports.group_state = function(user_id, group, callback) {
  return group_state(user_id, group, callback);
};

exports.getSocialState = function(userId, entityId, callback) {
  social_state(userId, entityId, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, social_state);
  });
};

function mall_state(user_id, mall, callback) {
  social_state(user_id, mall._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    mall.social_state = social_state;
    callback(null, mall);
  });
}

function chain_state(user_id, chain, callback) {
  social_state(user_id, chain._id, function(err, social_state) {
    if (err) {
      return callback(err, null);
    }
    chain.social_state = social_state;
    callback(null, chain);
  });
}


function update_states(userId, feeds, callback) {
  async.each(feeds, createUserUpdateStateFunction(userId), function(err){
    if(err) {callback(err, null)}
    else callback(null, feeds)
  });

}

function createUserUpdateStateFunction(userId) {
  return function update_state(feed, callback) {
    const activity = feed.activity;
    // replaced by userId so we will always get registered user state perspective
    //const entity = feed.entity
    async.parallel({
        promotion: function (callback) {
          if (utils.defined(activity.promotion))
            promotion_state(userId, activity.promotion, callback);
          else
            callback(null, null);
        },
        instance: function (callback) {
          if (utils.defined(activity.instance))
            instance_state(userId, activity.instance, callback);
          else
            callback(null, null);
        },
        post: function (callback) {
          if (utils.defined(activity.instance))
            post_state(userId, activity.instance, callback);
          else
            callback(null, null);
        },
        product: function (callback) {
          if (utils.defined(activity.product))
            product_state(userId, activity.product, callback);
          else
            callback(null, null);
        },
        user: function (callback) {
          if (utils.defined(activity.user))
            user_state(userId, activity.user, callback);
          else
            callback(null, null);
        },
        business: function (callback) {
          if (utils.defined(activity.business))
            business_state(userId, activity.business, callback);
          else
            callback(null, null);
        },
        mall: function (callback) {
          if (utils.defined(activity.mall))
            mall_state(userId, activity.mall, callback);
          else
            callback(null, null);
        },
        chain: function (callback) {
          if (utils.defined(activity.chain))
            chain_state(userId, activity.chain, callback);
          else
            callback(null, null);
        },
        group: function (callback) {
          if (utils.defined(activity.group))
            group_state(userId, activity.group, callback);
          else
            callback(null, null);
        },
        actor_user: function (callback) {
          if (utils.defined(activity.actor_user))
            user_state(userId, activity.actor_user, callback);
          else
            callback(null, null);
        },
        actor_business: function (callback) {
          if (utils.defined(activity.actor_business))
            business_state(userId, activity.actor_business, callback);
          else
            callback(null, null);
        },
        actor_mall: function (callback) {
          if (utils.defined(activity.actor_mall))
            mall_state(userId, activity.actor_mall, callback);
          else
            callback(null, null);
        },
        actor_chain: function (callback) {
          if (utils.defined(activity.actor_chain))
            chain_state(userId, activity.actor_chain, callback);
          else
            callback(null, null);
        },
        actor_group: function (callback) {
          if (utils.defined(activity.actor_group))
            group_state(userId, activity.actor_group, callback);
          else
            callback(null, null);
        }
      },
      function (err, states) {
        if (err) {
          return callback(err, null)
        }
        if (states.promotion)
          activity.promotion = states.promotion;
        if (states.instance)
          activity.instance = states.instance;
        if (states.product)
          activity.product = states.product;
        if (states.user)
          activity.user = states.user;
        if (states.business)
          activity.business = states.business;
        if (states.mall)
          activity.mall = states.mall;
        if (states.chain)
          activity.chain = states.chain;
        if (states.actor_user)
          activity.actor_user = states.actor_user;
        if (states.actor_business)
          activity.actor_business = states.actor_business;
        if (states.actor_mall)
          activity.actor_mall = states.actor_mall;
        if (states.actor_chain)
          activity.actor_chain = states.actor_chain;

        callback(null, feed)
      });
  }
}

function createFeedStateFunction(stated, userId, state_func) {
  return function(item, callback) {
    state_func(userId, item, function(err, withState){
      if(err) return callback(err);
      stated.insert(withState);
      callback(null, withState)
    })
  }
}

exports.get_items_state = function(items, userId, stateFunc, callback){
  this.generate_state(items, userId, stateFunc, callback)
};

exports.generate_state = function(items, userId, state_func, callback){
  let stated = new SortedArray([], function(a,b){
    return b._id - a._id; //descending order
  });
  async.each(items, createFeedStateFunction(stated, userId, state_func), function (err) {
    if (err) callback(err);
    return callback(null, stated.array);
  });
};

