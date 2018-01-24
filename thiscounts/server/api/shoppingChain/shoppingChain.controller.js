'use strict';

const _ = require('lodash');
const ShoppingChain = require('./shoppingChain.model');
const Business = require('../business/business.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('shoppingChain');
const MongodbSearch = require('../../components/mongo-search');
const Role = require('../../components/role');

exports.search = MongodbSearch.create(ShoppingChain);

// Get list of shoppingChains
exports.index = function(req, res) {
  ShoppingChain.find(function (err, shoppingChains) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(shoppingChains);
  });
};

// Get a single shoppingChain
exports.show = function(req, res) {
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if(err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    return res.json(shoppingChain);
  });
};

exports.addBusinessToChain = function(req, res) {
  Business.findById(req.params.businessId, (err, business) => {
    if(err) { return handleError(res, err); }
    if(!business) return res.status(404).send('Not Found');
    ShoppingChain.findById(req.params.chainId, (err, shoppingChain) => {
      if(err) { return handleError(res, err); }
      if(!shoppingChain) return res.status(404).send('Not Found');
      if(shoppingChain.creator !== business.creator._id) return res.status(4041).send('Only business and chain creator can add branches');
      graphModel.relate_ids(business._id, 'BRANCH_OF', shoppingChain._id, `{timestamp: "${Date.now()}"}`, (err)=> {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(shoppingChain);
      })
    });
  })
};

// Creates a new shoppingChain in the DB.
exports.create = function(req, res) {
  Business.findById(req.params.businessId, (err, business) => {
    if (err) {
      return handleError(res, err);
    }
    if (!business) return res.status(404).send('Not Found');
    if (req.user._id !== business.creator._id) return res.status(401).send('Only business creator can make it a chain');
    let chain = req.body;
    chain.branches = [business._id];
    chain.creator = req.user._id;
    ShoppingChain.create(chain, function (err, shoppingChain) {
      if (err) {
        return handleError(res, err);
      }
      graphModel.reflect(shoppingChain, function (err) {
        if (err) {
          return handleError(res, err);
        }
        Role.createRole(req.user._id, business._id, Role.Roles.get('OWNS'), function (err) {
          if (err) return console.error(err);
          graphModel.relate_ids(business._id, 'BRANCH_OF', shoppingChain._id, `{timestamp: "${Date.now()}"}`, (err) => {
            if (err) {
              return handleError(res, err);
            }
            return res.status(201).json(shoppingChain);
          });
        });
      });
    });
  })
};

// Updates an existing shoppingChain in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if (err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    let updated = _.merge(shoppingChain, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(shoppingChain);
    });
  });
};

// Deletes a shoppingChain from the DB.
exports.destroy = function(req, res) {
  ShoppingChain.findById(req.params.id, function (err, shoppingChain) {
    if(err) { return handleError(res, err); }
    if(!shoppingChain) { return res.status(404).send('Not Found'); }
    shoppingChain.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
