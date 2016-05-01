'use strict';

var _ = require('lodash');
var Category = require('./category.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('category');
var feedTools = require('../../components/feed-tools');
var Promotion = require('../promotion/promotion.model');

// Get list of categorys
exports.index = function(req, res) {
  Category.find(function (err, categorys) {
    if(err) { return handleError(res, err); }
    return res.json(200, categorys);
  });
};

// Get a single category
exports.show = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    return res.json(category);
  });
};

function fetch_paged_social_state(query_builder, req, _id, res) {
  query_builder = query_builder.sort({_id: -1}).limit(25);
  if (req.params.scroll === 'up')
    query_builder = query_builder.where('_id').gt(_id);
  else if (req.params.scroll === 'down')
    query_builder = query_builder.where('_id').lt(_id);

  return feedTools.fetch_social_state(query_builder, req.user._id, 'promotion', res)
}
exports.feed = function(req, res) {
  var _id = req.params._id;
  var category = req.body;
  var query;
  var query_builder = Promotion.find();
  switch (category.name) {
    case  'HOT'     :
      query = util.format("MATCH (u:user{_id:'%s'})-[l:LIKE]->(p:promotion)  \
                    RETURN p, COUNT(l)  \
                    ORDER BY COUNT(l) DESC  \
                    LIMIT 250", req.user._id);
      graphModel.query(query, function (err, hot) {
        if(err) { return handleError(res, err); }
        query_builder = Promotion.find({}).where('_id').in(hot);
        return fetch_paged_social_state(query_builder, req, _id, res);
      });
      break;
    case  'LIKE'    :
      query = util.format("MATCH (u:user{_id:'%s'})-[f:FOLLOW]->(o:user)-[l:LIKE]->(p:promotion) \
                    WHERE u._id <> o._id RETURN p._id order by p.created limit 250", req.user._id);
      graphModel.query(query, function (err, likes) {
         if(err) { return handleError(res, err); }
        query_builder = Promotion.find({}).where('_id').in(likes);
        return fetch_paged_social_state(query_builder, req, _id, res);
      });
      break;
    case  'MALL'    :
      query = util.format("MATCH (u:user{_id:'%s'})-[l:LIKE]->(m:mall)<-[l*1..]->(p:promotion) \
                    order by p.created limit 250", req.user._id);
      graphModel.query(query, function (err, malls) {
         if(err) { return handleError(res, err); }
        query_builder = Promotion.find({}).where('_id').in(malls);
        return fetch_paged_social_state(query_builder, req, _id, res);
      });
      break;
    case  'NEAR'    :
      query_builder = Promotion.find({ location: { $near: { type: 'Point', coordinates:[category.location.lng, category.location.lat] }}});
      break;
    case  'FASHION' :
      query_builder = Promotion.find({category: 'FASHION'});
      break;
    case  'GIFT'    :
      query_builder = Promotion.find({category: 'GIFT'});
      break;
  }
  return fetch_paged_social_state(query_builder, req, _id, res);
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  Category.create(req.body, function(err, category) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(category, function (err) {
      if (err) { return handleError(res, err); }
    });
    return res.json(201, category);
  });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Category.findById(req.params.id, function (err, category) {
    if (err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    var updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, category);
    });
  });
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    category.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
