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

exports.feed = function(req, res) {
  var _id = req.params._id;
  var category = req.body;

  var query_builder = Promotion.find();
  switch (category.name) {
    case  'HOT'     :
    case  'LIKE'    :
    case  'NEAR'    :
      query_builder = Promotion.find({ location: { $near: { type: 'Point', coordinates:[category.location.lng, category.location.lat] }}});
      break;
    case  'MALL'    :
      graphModel.query(query, callback)
    case  'FASHION' :
      query_builder = Promotion.find({category: 'FASHION'});
      break;
    case  'GIFT'    :
      query_builder = Promotion.find({category: 'GIFT'});
      break;
  }
  query_builder = query_builder.sort({_id: -1}).limit(25);
  if (req.params.scroll === 'up')
    query_builder = query_builder.where('_id').gt(_id);
  else if (req.params.scroll === 'down')
    query_builder = query_builder.where('_id').lt(_id);

  return feedTools.fetch_social_state(query_builder, req.user._id, 'promotion', res)
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
