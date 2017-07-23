'use strict';

let _ = require('lodash');
let async = require('async');
let utils = require('../../components/utils').createUtils();

let logger = require('../../components/logger').createLogger();
// let graphTools = require('../../components/graph-tools');
// let graphModel = graphTools.createGraphModel('user');
let feedTools = require('../../components/feed-tools');


let Feed = require('./feed.model');

// Get list of feeds
// See http://mongoosejs.com/docs/populate.html
exports.index = function (req, res){
  return feedTools.fetch_feed(req.user._id, Feed.find(), Feed, res );
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
  let userId = req.user._id;
  let from_id = req.params.from_id;
  let entity_id = req.params.entity_id;
  let scroll = req.params.scroll;

  if (req.params.scroll !== 'up' && req.params.scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');

  let query_builder;
  query_builder = Feed.find({entity: entity_id}).sort({activity: 'desc'}).limit(15);

  if (from_id === 'start') {
    return feedTools.fetch_feed(userId, query_builder, Feed, res);
  }
  if (req.params.scroll === 'up')
    query_builder = query_builder.where('_id').gt(from_id);
  else if (req.params.scroll === 'down')
    query_builder = query_builder.where('_id').lt(from_id);

  return feedTools.fetch_feed(userId, query_builder, Feed, res);
};



//[
//  {feed_id, top_id},
//  {feed_id, top_id},
//  {feed_id, top_id}
// ]
exports.new_count_group = function (req, res) {
  let list = req.body;
  function query_function(feed_id, top_id){
    return function(callback){
      Feed.count({_id: feed_id}).where('activity').gt(top_id).exec(function (err, objects) {
        if (err) { callback(err, null) }
        else callback(null, objects)
      });
    }
  }
  let queryFunctions = [];
  list.forEach( (pos) => {
    (function (feed_id, top_id) {
      queryFunctions.push(query_function(feed_id, top_id));
    })(pos.feed_id, pos.top_id);
  });
  async.parallel(queryFunctions, function(err, result) {
    console.log('ending: ' + result);
    res.status(200).json(result);
  });
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
    let updated = _.merge(feed, req.body);
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
