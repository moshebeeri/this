'use strict';

var _ = require('lodash');
var Feed = require('./feed.model');

// Get list of feeds
exports.index = function(req, res) {
  Feed.find(function (err, feeds) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(feeds);
  });
};

// Get a single feed
exports.show = function(req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if(err) { return handleError(res, err); }
    if(!feed) { return res.status(404).send('Not Found'); }
    return res.json(feed);
  });
};

// Creates a new feed in the DB.
exports.create = function(req, res) {
  Feed.create(req.body, function(err, feed) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(feed);
  });
};

// Updates an existing feed in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Feed.findById(req.params.id, function (err, feed) {
    if (err) { return handleError(res, err); }
    if(!feed) { return res.status(404).send('Not Found'); }
    var updated = _.merge(feed, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(feed);
    });
  });
};

// Deletes a feed from the DB.
exports.destroy = function(req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if(err) { return handleError(res, err); }
    if(!feed) { return res.status(404).send('Not Found'); }
    feed.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}