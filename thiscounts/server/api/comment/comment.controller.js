'use strict';

let _ = require('lodash');
let Comment = require('./comment.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('comment');
let Group         = require('../group/group.model');
let Brand         = require('../brand/brand.model');
let Business      = require('../business/business.model');
let ShoppingChain = require('../shoppingChain/shoppingChain.model');
let Mall          = require('../mall/mall.model');
let Product       = require('../product/product.model');
let Promotion     = require('../promotion/promotion.model');
let Instance      = require('../instance/instance.model');
let Activity      = require('../activity/activity.model');

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
function extract_ids(list){
  let ret = [];
  list.forEach(obj => {
    Object.keys(obj).forEach(key => {
      ret.push(obj[key])
    });
  });
  return ret;
}

function saveCommentToGroup(comment) {
  Group.findById(comment.entities.group).exec(function(err, group){
    if(err) { return console.log(err); }
    if(!group) { return console.log(`could not find group ${comment.entities.group} saveCommentToGroup`); }
    group.preview.comment = comment._id;
    group.save();
  })
}

// Creates a new comment.
exports.create = function(req, res) {
  let comment = req.body;
  let entities = extract_ids(comment.entities);
  comment.user = req.user._id;
  comment.entities = list2object(comment.entities);
  comment.created = Date.now();
  Comment.create(comment, function(err, comment) {
    if(err) { return handleError(res, err); }
    if(comment.entities && comment.entities.group){
      saveCommentToGroup(comment);
    }
    graphModel.reflect(comment, {
      _id: comment._id
    },function (err, comment) {
      if (err) { return handleError(res, err); }
      let params = `{comment_id:"${comment._id}"}`;

      graphModel.relate_ids(req.user._id, 'COMMENTED', entities[0], params);
      for(let i = 0; i < entities.length; i++) {
        if(i === entities.length-1)
          graphModel.relate_ids(entities[i], 'COMMENTED', comment._id, params);
        else
          graphModel.relate_ids(entities[i], 'COMMENTED', entities[i+1], params);
      }
    });
    return res.status(201).json(comment);
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
      return res.status(200).json(comment);
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

exports.scroll = function(req, res) {
  const page_size = 50;
  const from_id = req.params.from;
  const scroll = req.params.scroll;

  if (scroll !== 'up' && scroll !== 'down')
    return res.status(400).send('scroll value may be only up or down');

  let condition = scroll === 'up'? `c._id > '${from_id}'` : `c._id < '${from_id}'`;
  if(from_id === 'start')
    condition = `c._id > ''`;

  let query = ` match (c:comment), (u:user), (g:group{_id:'${req.params.group}'}) 
                where ((u)-[:COMMENTED]->(g)-[:COMMENTED]->()-[:COMMENTED]->(c) 
                          OR
                       (u)-[:COMMENTED]->(g)-[:COMMENTED]->(c)
                      )
                      AND ${condition}
                return distinct c._id as _id`;
  graphModel.query_objects(Comment, query,
    `order by c._id desc`,
    0, page_size, function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(comments);
    })
};

exports.find = function(req, res) {
  let query = 'match (:user)-[:COMMENTED]';
  let entities = extract_ids(req.body.entities);

  for(let i=0; i<entities.length; i++) {
    query += `->(e${i}{_id:'${entities[i]}'})-[:COMMENTED]`;
  }
  query += `->(c:comment) return c._id as _id `;
  graphModel.query_objects(Comment, query,
    `ORDER BY e${entities.length-1}._id DESC`,
    req.params.skip, req.params.limit, function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(comments);
  })
};

// match (u:user)-[:COMMENTED]-(g:group{_id:"59f98c2d188c39245676df87"})-[:COMMENTED]-(e)-[:COMMENTED]-(c:comment)
// return distinct u,g,c,labels(e) order by c._id desc
//https://stackoverflow.com/questions/26474453/match-with-or-condition
exports.group_chat = function(req, res) {
  let query = ` match (u:user)-[:COMMENTED]-(g:group{_id:"${req.params.group}"})-[:COMMENTED]-(e)-[:COMMENTED]-(c:comment)
                return distinct c._id as _id`;
  graphModel.query_objects(Comment, query,
    `order by c._id desc`,
    req.params.skip, req.params.limit, function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(comments);
    })
};

function getSchema(type) {
  switch(type){
    case "group":            return   Group;
    case "brand":            return   Brand;
    case "business":         return   Business;
    case "shopping_chain":   return   ShoppingChain;
    case "mall":             return   Mall;
    case "product":          return   Product;
    case "promotion":        return   Promotion;
    case "instance":         return   Instance;
    case "activity":         return   Activity;
  }
}

exports.conversed = function(req, res) {
  let query = 'match ';
  let entities = extract_ids(req.body.entities);
  let schema = getSchema(req.params.type); //getSchema(req.body.entities);

  for(let i=0; i<entities.length; i++)
    query += `(e${i}{_id:'${entities[i]}'})-[:COMMENTED]->`;

  query += `(e:${req.params.type})-[:COMMENTED]->(:comment) with distinct e._id as _id return _id `;
  graphModel.query_objects(schema, query,
    `ORDER BY _id DESC`,
    req.params.skip, req.params.limit, function (err, comments) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(comments);
    })
};

function handleError(res, err) {
  console.error(err);
  return res.status(500).send(err);
}
