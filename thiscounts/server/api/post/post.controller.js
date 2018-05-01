'use strict';

const _ = require('lodash');
const Post = require('./post.model');
const Group = require('../group/group.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('post');
const activity = require('../../components/activity').createActivity();
const pricing = require('../../components/pricing');
const LinkPreview = require('../../components/link-preview');

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
    return console.log(`handlePostCreation param post invalid: post._id})`);

  graphModel.relate_ids(post.creator._id, 'POSTED_BY', post._id);
  graphModel.relate_ids(post._id, 'POSTED_ON', getActorId(post));
  if(post.behalf.group) {
    Group.findById(post.behalf.group).exec(function (err, group) {
      group.preview.post = post._id;
      group.preview.instance_activity = null;
      group.save();
    })
  }
}

// Creates a new post in the DB.
exports.create = function(req, res) {
  let post = req.body;

  if(!getActorId(post))
    return handleError(res, new Error('no actor (behalf) present'));
  if(!post.feed || !post.feed.user || post.feed.group)
    return handleError(res, new Error('no feed specified'));

  function createPost() {
    Post.create(post, function (err, post) {
      if (err) {
        return handleError(res, err);
      }
      graphModel.reflect(post, {_id: post._id}, function (err) {
        if (err) {
          return handleError(res, err);
        }
        handlePostCreation(post);
        const act = {
          creator: post.creator,
          actor_user: post.behalf.user,
          actor_business: post.behalf.business,
          actor_mall: post.behalf.mall,
          actor_chain: post.behalf.chain,
          sharable: typeof(post.sharable) === 'boolean' ? post.sharable : true,
          post: post._id,
          action: 'post',
          audience: ['SELF', 'FOLLOWERS']
        };

        if (post.feed.user)
          act.audience = ['SELF', 'FOLLOWERS'];
        else if (post.feed.group)
          act.ids = [post.feed.group];
        else
          return handleError(res, new Error(`unsupported feed type, expects `));


        Post.findById(post._id).exec((err, post) => {
          if (err) {
            return handleError(res, err);
          }
          pricing.balance(post.behalf, function (err, positiveBalance) {
            if (err) return handleError(res, err);
            if (!positiveBalance) return res.status(402).send(post);
            //console.log(`exports.create post ${JSON.stringify({act})}`);
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
  }

  post.creator = req.user._id;
  post.created = Date.now();
  LinkPreview.getPreview(post.text)
    .then(linkPreview => {
      post.textLinkPreview = linkPreview;
      return createPost();
    })
    .catch(() => {
      return createPost();
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
  console.error(err);
  return res.status(500).send(err);
}
