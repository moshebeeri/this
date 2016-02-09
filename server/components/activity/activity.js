'use strict';

var _ = require('lodash');
var util = require('util');
var graphTools = require('../graph-tools');
var graphModel = graphTools.createGraphModel('feed');
var logger = require('../logger').createLogger();
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Feed = require('../../api/feed/feed.model');
var ActivitySchema = require('../../api/activity/activity.model');


function Activity() {
  logger.info("Activity constructed");
}
//pagination http://blog.mongodirector.com/fast-paging-with-mongodb/
function update_feeds(effected, activity) {
  mongoose.connection.db.collection('feed', function (err, collection) {
    if (err) return logger.error(err.message);
    effected.forEach(function (user) {
      Feed.create({
          user: user._id,
          activity: activity._id
      }, function(err) {
        if(err) { logger.error(err.message); }
      });
    });
  });
}

/**
 * @param activity
 * @param callback
 *
 * {
 *   promotion : promotion ,
 *   product   : product   ,
 *   user      : user      ,
 *   business  : business  ,
 *   mall      : mall      ,
 *   chain     : chain     ,
 *
 *   actor_user      : user      ,
 *   actor_business  : business  ,
 *   actor_mall      : mall      ,
 *   actor_chain     : chain     ,
 *
 *   action    : action
 * }
 */
Activity.prototype.activity = function activity(activity, callback) {
  activity_impl(activity, callback);
};

function activity_impl(activity, callback){
  ActivitySchema.create(activity, function (err, activity) {
    if (err) {
      callback(err, null);
      return;
    }
    if (activity.actor_user) {
      effected_in_rel(activity.actor_user, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity)
      });
    }
    else if (activity.actor_business) {
      effected_out_rel(activity.actor_business, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity)
      });
    }
    else if (activity.actor_mall) {
      effected_out_rel(activity.actor_mall, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity)
      });

    }
    else if (activity.actor_chain) {
      effected_out_rel(activity.actor_chain, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity)
      });
    }
  });

}

Activity.prototype.action_activity = function action_activity(userId, itemId, action) {
  var act = {
    actor_user: userId,
    action: action
  };

  async.parallel({
    user: function (callback) {
      User.findById(itemId, callback);
    },
    business: function (callback) {
      Business.findById(itemId, callback);
    },
    chain: function (callback) {
      ShoppingChain.findById(itemId, callback);
    },
    product: function (callback) {
      Product.findById(itemId, callback);
    },
    promotion: function (callback) {
      Promotion.findById(itemId, callback);
    },
    mall: function (callback) {
      Mall.findById(itemId, callback);
    }
  }, function (err, results) {
    for (var key in results) {
      if (!_.isUndefined(results[key])) {
        switch (key) {
          case 'user':
            act.user = itemId;
            break;
          case 'business':
            act.business = itemId;
            break;
          case 'chain':
            act.chain = itemId;
            break;
          case 'product':
            act.product = itemId;
            break;
          case 'promotion':
            act.promotion = itemId;
            break;
          case 'mall':
            act.mall = itemId;
            break;
        }
        activity_impl(act, function (err) {
          if (err) logger.error(err.message)
        });
      }
    }
  });
};



function run(query, callback) {
  var db = graphModel.db();
  db.query(query, function (err, effected) {
    if (err) {
      return callback(err, null);
    }
    callback(null, effected);
  });
}
//MATCH (actor) where actor._id='56a3cb8071cef8c460461c08' return actor
function effected_out_rel(actor_id, relationship, callback) {
  var query = util.format(" MATCH (actor)-[:%s]->(effected) \
                            where actor._id='%s'         \
                            return effected ", relationship, actor_id);
  run(query, callback);
}

function effected_in_rel(actor_id, relationship, callback) {
  var query = util.format(" MATCH (actor)<-[:%s]-(effected) \
                            where actor._id='%s'         \
                            return effected ", relationship, actor_id);
  run(query, callback);
}
function like_effected(actor) {
  return effected(actor, 'LIKE');
}


module.exports = Activity;







