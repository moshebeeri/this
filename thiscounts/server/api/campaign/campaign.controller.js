'use strict';

var _ = require('lodash');
var Campaign = require('./campaign.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('campaign');
var Promotion = require('../promotion/promotion.controller');

// Get list of campaigns
exports.index = function(req, res) {
  Campaign.find(function (err, campaigns) {
    if(err) { return handleError("1", res, err); }
    return res.status(200).json(campaigns);
  });
};

// Get a single campaign
exports.show = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError("2",res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    return res.json(campaign);
  });
};

// Creates a new campaign in the DB.
exports.create = function(req, res) {
  req.body.creator = req.user._id;
  Campaign.create(req.body, function(err, campaign) {
    if(err) { return handleError("3",res, err); }
    graphModel.reflect(campaign, to_graph(campaign), function (err) {
      if (err) { return handleError("4",res, err); }
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
    if (err) { return handleError("5",res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    var updated = _.merge(campaign, req.body);
    updated.save(function (err) {
      if (err) { return handleError("6",res, err); }
      return res.status(200).json(campaign);
    });
  });
};

// Deletes a campaign from the DB.
exports.destroy = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError("7",res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    campaign.remove(function(err) {
      if(err) { return handleError("8",res, err); }
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

exports.business_campagins = function (req, res) {
  console.log("user_campagins");
  console.log("user: " + req.user._id);
  var userID = req.user._id;
  var businessID = req.params.business_id;
  console.log("MATCH (u:user {_id:'"+ userID +"'})-[r:OWNS]->(b:business {_id:'"+ businessID +"'})-[bc:BUSINESS_CAMPAIGN]->(c:campaign) RETURN c LIMIT 25");
  graphModel.query("MATCH (u:user {_id:'"+ userID +"'})-[r:OWNS]->(b:business {_id:'"+ businessID +"'})-[bc:BUSINESS_CAMPAIGN]->(c:campaign) RETURN c LIMIT 25", function(err, groups){
    if (err) {return handleError("13",res, err)}
    if(!groups) { return res.send(404); }
    console.log(JSON.stringify(groups));
    return res.status(200).json(groups);
  });
};

function handleError(msg, res, err) {
  console.log("--------- " + msg + " ---------");
  console.log(err);
  return res.status(500).send(err);
}
