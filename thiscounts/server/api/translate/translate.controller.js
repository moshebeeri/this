'use strict';

let _ = require('lodash');
let Translate = require('./translate.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('translate');
let spatial = require('../../components/spatial').createSpatial();
let location = require('../../components/location').createLocation();
let logger = require('../../components/logger').createLogger();
let MongodbSearch = require('../../components/mongo-search');


exports.search = MongodbSearch.create(Translate);

// Get list of translates
exports.index = function(req, res) {
  Translate.find(function (err, translates) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(translates);
  });
};

// Get a single translate
exports.show = function(req, res) {
  Translate.findById(req.params.id, function (err, translate) {
    if(err) { return handleError(res, err); }
    if(!translate) { return res.status(404).send('Not Found'); }
    return res.json(translate);
  });
};

// Creates a new translate in the DB.
exports.create = function(req, res) {
  let translate = req.body;
  location.address_location( translate, function(err, data) {
    if (err) {
      if (err.code >= 400) return res.status(err.code).send(err.message);
      else if (err.code === 202) return res.status(202).json(data)
    }
    translate.location = spatial.geo_to_location(data);
    Translate.create(translate, function(err, translate) {
      if(err) { return handleError(res, err); }
      graphModel.reflect(translate, {
        _id: translate._id,
        name: translate.name,
        lat: translate.location.lat,
        lon: translate.location.lng
      }, function (err) {
        if (err) {  return handleError(res, err); }
        spatial.add2index(translate.gid, function(err, result){
          if(err) return logger.error(err.message);
          //else logger.info('object added to layer ' + result)
        });

      });
      return res.status(201).json(translate);
    });
  });
};

// Updates an existing translate in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Translate.findById(req.params.id, function (err, translate) {
    if (err) { return handleError(res, err); }
    if(!translate) { return res.status(404).send('Not Found'); }
    let updated = _.merge(translate, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(translate);
    });
  });
};

// Deletes a translate from the DB.
exports.destroy = function(req, res) {
  Translate.findById(req.params.id, function (err, translate) {
    if(err) { return handleError(res, err); }
    if(!translate) { return res.status(404).send('Not Found'); }
    translate.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
