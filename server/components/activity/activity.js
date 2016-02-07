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
  run(db, query, callback);
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







