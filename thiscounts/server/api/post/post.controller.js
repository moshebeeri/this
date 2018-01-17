'use strict';

const _ = require('lodash');
const Post = require('./post.model');
const Group = require('../group/group.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('post');
const activity = require('../../components/activity').createActivity();
const pricing = require('../../components/pricing');

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

function getActorId(post){
  if( post.behalf.user      ) return post.behalf.user    ;
  if( post.behalf.business  ) return post.behalf.business;
  if( post.behalf.mall      ) return post.behalf.mall    ;
  if( post.behalf.chain     ) return post.behalf.chain   ;
  if( post.behalf.group     ) return post.behalf.group   ;
  return null;
}

function handlePostCreation(post) {
  if(!post || !post.creator || !post._id)
    return console.log(`handlePostCreation param post invalid: ${JSON.stringify(post)})`);

  graphModel.relate_ids(post.creator._id, 'POSTED_BY', post._id);
  graphModel.relate_ids(post._id, 'POSTED_ON', getActorId(post));
  if(post.behalf.group) {
    Group.findById(post.behalf.group).exec(function (err, group) {
      group.preview.post = post._id;
      group.save();
    })
  }
}

// Creates a new post in the DB.
exports.create = function(req, res) {
  let post = req.body;
  if(!getActorId(post))
    return handleError(res, new Error('no actor (behalf) present'));

  post.creator = req.user._id;
  post.created = Date.now();
  Post.create(post, function(err, post) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(post, {_id: post._id}, function (err) {
      if (err) { return handleError(res, err); }
      handlePostCreation(post);
      const act = {
        actor_user      : post.behalf.user    ,
        actor_business  : post.behalf.business,
        actor_mall      : post.behalf.mall    ,
        actor_chain     : post.behalf.chain   ,
        actor_group     : post.behalf.group   ,
        post: post._id,
        action: 'post',
      };

      if(act.actor_user)
        act.audience =['SELF', 'FOLLOWERS'];
      else if(act.actor_group)
        act.ids = [act.actor_group];
      Post.findById(post._id).exec( (err, post) =>{

        if (err) { return handleError(res, err); }
        pricing.balance(post.behalf, function (err, positiveBalance) {
          if (err) return handleError(res, err);
          if (!positiveBalance) return res.status(402).send(post);
          activity.activity(act, function (err) {
            if (err) {
              return handleError(res, err);
            }
            pricing.chargeActivityDistribution(post.behalf, activity);
            return res.status(201).send(post);
          });
        })
      })
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
