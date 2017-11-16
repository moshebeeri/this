'use strict';

let _ = require('lodash');
let Post = require('./post.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('post');
const activity = require('../../components/activity').createActivity();

// Get list of posts
exports.index = function(req, res) {
  Post.find(function (err, posts) {
    if(err) { return handleError(res, err); }
    return res.status(200).send(posts);
  });
};

// Publish post
/**
 * @param req
  body should contain only one of:
    actor_user
    actor_business
    actor_mall
    actor_chain
    actor_group

 */
exports.publish = function(req, res) {
  let actor = req.body;
  if(Object.keys(actor).length !== 1)
    return res.status(400).send('expecting only one actor');

  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    activity.activity({
      actor_user      : actor.actor_user    ,
      actor_business  : actor.actor_business,
      actor_mall      : actor.actor_mall    ,
      actor_chain     : actor.actor_chain   ,
      actor_group     : actor.actor_group   ,
      post: post._id,
      action: 'post'
    }, function (err) {
      if (err) console.error(err.message)
    });
    return res.status(200).send(post);
  });
};

// Get a single post
exports.show = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.status(200).send(post);
  });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  let post = req.body;
  post.created = Date.now();
  Post.create(post, function(err, post) {
    if(err) { return handleError(res, err); }
    // graphModel.reflect(post, {_id: post._id}, function (err) {
    //   if (err) { return handleError(res, err); }
    // });
    return res.status(201).send(post);
  });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    let updated = _.merge(post, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).send(post);
    });
  });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    post.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
