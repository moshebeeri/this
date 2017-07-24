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

function list2object(list){
  let ret = {};
  list.forEach(obj => {
    let key = Object.keys(obj)[0];
    ret[key] = obj[key]
  });
  return ret;
}

// Creates a new comment in the DB.
exports.create = function(req, res) {
  let comment = req.body;
  let entities = comment.entities;
  comment.user = req.user._id;
  comment.entities = list2object(entities);

  Comment.create(comment, function(err, comment) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(comment, function (err, comment) {
      if (err) {  return handleError(res, err); }
      let params = `{comment_id:${comment._id}}`;
      for (let i = 0; i < entities.length; i++) {
        if (i === 0)
          graphModel.relate_ids(req.user._id, 'COMMENTED', entities[0] , params);
        if (i === entities.length-1)
          graphModel.relate_ids(entities[i], 'COMMENTED', comment._id , params);
        else
          graphModel.relate_ids(entities[i-1], 'COMMENTED', entities[i], params);
      }
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
  let query = '(:user)-[:COMMENTED]';
  let entities = req.body;

  for(let i=0; i<entities.length; i++) {
    query += `->(e${i}:{_id:'${entities[i]}'})-[:COMMENTED]`;
  }
  query += `->(:comment) return e${entities.length-1}._id as _id `;

  graphModel.query_objects(Comment, query,
    `ORDER BY e${entities.length-1}._id DESC`,
    req.params.skip, req.params.limit, function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.json(200, comments);
  })
};

function handleError(res, err) {
  return res.send(500, err);
}
