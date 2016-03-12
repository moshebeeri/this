'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var logger = require('../../components/logger').createLogger();
var User = require('../user/user.model');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('business');
var spatial = require('../../components/spatial').createSpatial();
var location = require('../../components/location').createLocation();
var utils = require('../../components/utils').createUtils();
var activity = require('../../components/activity').createActivity();

exports.address2 = function(req, res) {
  location.address( req.body.address, function(err, data){
    if(err) {return handleError(res, err);}
    //logger.info(data);
    if(data.results==0)
      return res.status(400).send('No location under this address : ' + req.body.address );

    if(data.results.length > 1)
      return res.status(400).send('Inconsistent address, google api find more then one location under this address : ' + req.body.address );

    logger.info("lat:" +data.results[0].geometry.location.lat);
    logger.info("lng:" +data.results[0].geometry.location.lng);
    return res.status(200).send();
  });
};

// Get list of businesses
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

exports.mine = function(req, res) {
  var userId = req.user._id;
  Business.find({'creator' : userId}, function (err, businesses) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(businesses);
  });
};

function defined(obj){
  return utils.defined(obj);
}

exports.create = function(req, res) {
  var creator = null;
  var body_business = req.body;
  var userId = req.user._id;
  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    creator = user;
  });
  body_business.creator = userId;
     if (err) {
      if (err.code >= 400) return res.status(err.code).send(err.message);
      else if (err.code == 202) return res.status(202).json(data)
    }
    body_business.location = spatial.geo_to_location(data);

    //console.log(body_business.location);
    Business.create(body_business, function(err, business) {
      if(err) { return handleError(res, err); }
      graphModel.reflect(business, {
        _id: business._id,
        name: business.name,
        creator: business.creator,
        lat: body_business.location.lat,
        lon: body_business.location.lng
      }, function (err, business ) {
        if (err) {  return handleError(res, err); }
        graphModel.db().relate(creator.gid, 'OWNS', business.gid, {}, function(err, relationship) {
          if(err) {console.log(err.message);}
          logger.info('(' + relationship.start + ')-[' + relationship.type + ']->(' + relationship.end + ')');

          if(defined(business.shopping_chain))
            graphModel.db().relate_ids(business._id, 'BRANCH_OF', business.shopping_chain);

          if(defined(business.mall))
            graphModel.db().relate_ids(business._id, 'IN_MALL', business.mall);

          spatial.add2index(business.gid, function(err, result){
            if(err) logger.error(err.message);
            else logger.info('object added to layer ' + result)
          });
        });
        activity.activity({
          business  : business._id,
          actor_user: business.creator,
          action : "created"
        }, function (err) {if(err) logger.error(err.message)});
      });
      return res.status(201).json(business);
    });
};

/* {
*   promotion : promotion ,
*   user      : user      ,
*   business  : business  ,
*   mall      : mall      ,
*   chain     : chain     ,
*
*   actor_user      : user      ,
*   actor_business  : business  ,
*   actor_mall      : mall      ,
*   actor_chain     : chain     ,
*
*   action    : action
 * } */



// Updates an existing business in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Business.findById(req.params.id, function (err, business) {
    if (err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    var updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroy = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    business.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
