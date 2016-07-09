'use strict';

var _ = require('lodash');
var util = require('util');
var graphTools = require('../graph-tools');
var graphModel = graphTools.createGraphModel('feed');
var logger = require('../logger').createLogger();
var utils = require('../utils').createUtils();
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

function update_group_feeds(effected, activity) {
  mongoose.connection.db.collection('feed', function (err, collection) {
    if (err) return logger.error(err.message);
    effected.forEach(function (group) {
      Feed.create({
          group: group._id,
          activity: activity._id
      }, function(err) {
        if(err) { logger.error(err.message); }
      });
    });
  });
}

Activity.prototype.group_activity = function group_activity(act, callback) {
  ActivitySchema.create(act, function (err, activity) {
    if (err) {
      callback(err, null);
      return;
    }
    //update own group
    var query = util.format(" MATCH (actor:group) \
                              where actor._id='%s'         \
                              return actor ", act.actor_group);
    run(query, function (err, group) {
      if (err) { return callback(err, null); }
      update_group_feeds(group, activity);

      //update following groups
      var query = util.format(" MATCH (actor:group)<-[:FOLLOW]-(effected:group) \
                              where actor._id='%s'         \
                              return effected ", act.actor_group);
      run(query, function (err, effected) {
        if (err) { return callback(err, null); }
        update_group_feeds(effected, activity);
        callback(null, activity)
      });
    });
  });
};

/**
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
 * @param act
 * @param callback
 */
Activity.prototype.activity = function activity(act, callback) {
  activity_impl(act, callback);
};

function activity_impl(act, callback){
  ActivitySchema.create(act, function (err, activity) {
    if (err) {
      callback(err, null);
      return;
    }
    if (activity.actor_user) {
      effected_in_rel(activity.actor_user, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_business) {
      effected_out_rel(activity.actor_business, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_mall) {
      effected_out_rel(activity.actor_mall, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });

    }
    else if (activity.actor_chain) {
      effected_out_rel(activity.actor_chain, "LIKE", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_group) {
      effected_in_rel(activity.actor_group, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
  });

}

Activity.prototype.action_activity = function action_activity(userId, itemId, action) {
  var act = {
    actor_user: userId,
    action: action
  };
  utils.parallel_id(itemId, act, function(err, act){
    if(err) {return callback(err, null)}
    activity_impl(act, function(err){
      if(err) {logger.error(err.message)}
    });
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


module.exports = Activity;







