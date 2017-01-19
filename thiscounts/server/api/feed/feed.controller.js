'use strict';

var _ = require('lodash');
var async = require('async');
var utils = require('../../components/utils').createUtils();

var logger = require('../../components/logger').createLogger();
// var graphTools = require('../../components/graph-tools');
// var graphModel = graphTools.createGraphModel('user');
var feedTools = require('../../components/feed-tools');


var Feed = require('./feed.model');

// Get list of feeds
// See http://mongoosejs.com/docs/populate.html
exports.index = function (req, res){
  return feedTools.fetch_feed(Feed.find(), Feed, res );
};

// Get a single feed
exports.show = function (req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    return res.json(feed);
  });
};

// feed
exports.feed = function (req, res) {
  //var userId = req.user._id;
  var from_id = req.params.from_id;
  var entity_id = req.params.entity_id;
  var entity_type = req.params.entity_type;
  var scroll = req.params.scroll;
  console.log("=============================================");
  console.log("from_id: " + from_id);
  console.log("entity_id: " + entity_id);
  console.log("entity_type: " + entity_type);
  console.log("scroll: " + scroll);
  console.log("=============================================");

  if (req.params.scroll != 'up' && req.params.scroll != 'down')
    return res.status(400).send('scroll value may be only up or down');

  var query_builder;
  if(entity_type=="user")
    query_builder = Feed.find({user: entity_id}).sort({activity: -1}).limit(25);
  else if (entity_type=="group")
    query_builder = Feed.find({group: entity_id}).sort({activity: -1}).limit(25);

  if (from_id == 'start') {
    return feedTools.fetch_feed(query_builder, Feed, res);
  }
  if (req.params.scroll === 'up')
    query_builder = query_builder.where('_id').gt(from_id);
  else if (req.params.scroll === 'down')
    query_builder = query_builder.where('_id').lt(from_id);

  return feedTools.fetch_feed(query_builder, Feed, res);
};


//exec(callback);
//
//Feed.
//find({
//  user: userId,
//  age: { $gt: 17, $lt: 66 },
//  likes: { $in: ['vaporizing', 'talking'] }
//}).
//limit(10).
//sort({ occupation: -1 }).
//select({ name: 1, occupation: 1 }).


// Creates a new feed in the DB.
exports.create = function (req, res) {
  Feed.create(req.body, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(feed);
  });
};

// Updates an existing feed in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(feed, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(feed);
    });
  });
};

// Deletes a feed from the DB.
exports.destroy = function (req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    feed.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
