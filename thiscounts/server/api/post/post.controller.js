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
  console.log('create post????');
  let post = req.body;
  post.creator = req.user._id;
  post.created = Date.now();
  Post.create(post, function(err, post) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(post, {_id: post._id}, function (err) {
      if (err) { return handleError(res, err); }
      activity.activity({
        actor_user      : post.behalf.user    ,
        actor_business  : post.behalf.business,
        actor_mall      : post.behalf.mall    ,
        actor_chain     : post.behalf.chain   ,
        actor_group     : post.behalf.group   ,
        post: post._id,
        action: 'post',
        audience: ['SELF', 'FOLLOWERS']
      }, function (err) {
        if(err) { return handleError(res, err); }
        return res.status(201).send(post);
      });
    });
  });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    if(post.creator._id !== req.user._id) { return res.send(401); }
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
    if(post.creator._id !== req.user._id) { return res.send(401); }
    post.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
