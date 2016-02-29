'use strict';

var _ = require('lodash');
var Review = require('./review.model');

// Get list of reviews
exports.index = function(req, res) {
  Review.find(function (err, reviews) {
    if(err) { return handleError(res, err); }
    return res.json(200, reviews);
  });
};

// Get a single review
exports.show = function(req, res) {
  Review.findById(req.params.id, function (err, review) {
    if(err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    return res.json(review);
  });
};

exports.element_reviews = function(req, res) {
  Review.find({'element_id':req.params.id})
    .populate({path: 'creator', select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'})
    .populate({path: 'product'})
    .populate({path: 'promotion'})
    .populate({path: 'business'})
    .populate({path: 'mall'})
    .populate({path: 'chain'})
    .exec(function (err, reviews) {
    if(err) { return handleError(res, err); }
    if(!reviews) { return res.send(404); }
    return res.json(reviews);
  });
};

// Creates a new review in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  var review = req.body;
  review.creator = userId;
  utils.parallel_id(review.element_id, review, function(err, review){
    if(err) { return handleError(res, err); }
    Review.create(review, function(err, review) {
      if(err) { return handleError(res, err); }
      return res.json(201, review);
    });
  });
};

// Updates an existing review in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Review.findById(req.params.id, function (err, review) {
    if (err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    var updated = _.merge(review, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, review);
    });
  });
};

// Deletes a review from the DB.
exports.destroy = function(req, res) {
  Review.findById(req.params.id, function (err, review) {
    if(err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    review.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
