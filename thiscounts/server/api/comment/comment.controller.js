'use strict';

let _ = require('lodash');
let Comment = require('./comment.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('comment');

// Get list of comments
exports.index = function(req, res) {
  Comment.find(function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};

// Get a single comment
exports.show = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    return res.json(comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  let comment = req.body;
  comment.user = req.user._id;
  Comment.create(comment, function(err, comment) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(comment, function (err, comment) {
      if (err) {  return handleError(res, err); }
      graphModel.relate_ids(req.user._id, 'COMMENTED', comment._id)
    });
    return res.json(201, comment);
  });
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    let updated = _.merge(comment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    comment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.find = function(req, res) {
  Comment.find({ $or:[
    {'entity.brand'         : req.params.entity},
    {'entity.business'      : req.params.entity},
    {'entity.shopping_chain': req.params.entity},
    {'entity.mall'          : req.params.entity},
    {'entity.product'       : req.params.entity},
    {'entity.promotion'     : req.params.entity},
    {'entity.instance'      : req.params.entity},
    {'entity.activity'      : req.params.entity}
    ]})
    .sort({_id: 'desc'})
    .skip(req.params.skip)
    .limit(req.params.limit)
    .exec(function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.json(200, comments);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
