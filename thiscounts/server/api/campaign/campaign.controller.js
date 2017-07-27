'use strict';

let _ = require('lodash');
let Campaign = require('./campaign.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('campaign');
let Promotion = require('../promotion/promotion.controller');

// Get list of campaigns
exports.index = function(req, res) {
  Campaign.find(function (err, campaigns) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(campaigns);
  });
};

// Get a single campaign
exports.show = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    return res.json(campaign);
  });
};

exports.create_campaign = function(campaign, callback) {
  Campaign.create(campaign, function(err, campaign) {
    if(err) { return callback(err); }
    graphModel.reflect(campaign, to_graph(campaign), function (err) {
      if(err) { return callback(err); }
      callback(null, campaign);
    });
  });
};

// Creates a new campaign in the DB.
exports.create = function(req, res) {
  req.body.creator = req.user._id;
  this.create_campaign(req.body, function(err, campaign) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(campaign, to_graph(campaign), function (err) {
      if (err) { return handleError(res, err); }
    });
    graphModel.relate_ids(req.body["business_id"], 'BUSINESS_CAMPAIGN', campaign._id );
    req.body["type"] = 'PERCENT';
    req.body["campaign_id"] = campaign._id;
    Promotion.create(req, res);
    //return res.status(201).json(campaign);
  });
};

// Updates an existing campaign in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Campaign.findById(req.params.id, function (err, campaign) {
    if (err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    let updated = _.merge(campaign, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(campaign);
    });
  });
};

// Deletes a campaign from the DB.
exports.destroy = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    campaign.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function to_graph(campaign) {
  return {
    _id: campaign._id,
    name: campaign.name
  }
}

exports.business_campaigns = function (req, res) {
  let userID = req.user._id;
  let businessID = req.params.business_id;
  graphModel.query("MATCH (u:user {_id:'"+ userID +"'})-[r:OWNS]->(b:business {_id:'"+ businessID +"'})-[bc:BUSINESS_CAMPAIGN]->(c:campaign) RETURN c LIMIT 25", function(err, groups){
    if (err) {return handleError(res, err)}
    if(!groups) { return res.send(404); }
    return res.status(200).json(groups);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
