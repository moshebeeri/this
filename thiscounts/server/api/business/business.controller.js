'use strict';

let _ = require('lodash');
let Business = require('./business.model');
let logger = require('../../components/logger').createLogger();
let User = require('../user/user.model');

let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('business');
let spatial = require('../../components/spatial').createSpatial();
let location = require('../../components/location').createLocation();
let utils = require('../../components/utils').createUtils();
let activity = require('../../components/activity').createActivity();

exports.address2 = function (req, res) {
  location.address(req.body.address, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    //logger.info(data);
    if (data.results === 0)
      return res.status(400).send('No location under this address : ' + req.body.address);

    if (data.results.length > 1)
      return res.status(400).send('Inconsistent address, google api find more then one location under this address : ' + req.body.address);

    logger.info("lat:" + data.results[0].geometry.location.lat);
    logger.info("lng:" + data.results[0].geometry.location.lng);
    return res.status(200).send();
  });
};

// Get list of businesses
exports.index = function (req, res) {
  Business.find(function (err, businesss) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function (req, res) {
  Business.findById(req.params.id, function (err, business) {
    if (err) {
      return handleError(res, err);
    }
    if (!business) {
      return res.status(404).send('Not Found');
    }
    return res.json(business);
  });
};

exports.mine = function (req, res) {
  let userId = req.user._id;
  console.log("get businesses of user " + userId );
  Business.find({'creator': userId}, function (err, businesses) {
    if (err) {
      return handleError(res, err);
    }
    if (!defined(businesses)) {
      return res.status(404).send('Not Found');
    }
    return res.status(200).json(businesses);
  });
};

function defined(obj) {
  return utils.defined(obj);
}

exports.create = function (req, res) {
  let body_business = req.body;
  let userId = req.user._id;

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    let creator = null;
    creator = user;
    body_business.creator = userId;

    location.address_location(body_business, function (err, data) {
      if (err) {
        if (err.code >= 400) return res.status(err.code).send(err.message);
        else if (err.code === 202) {
          console.log(err);
          return res.status(202).json(data);
        }
        else return res.status(400).send(err);
      }

      body_business.location = spatial.geo_to_location(data);

      Business.create(body_business, function (err, business) {
        if (err) return handleError(res, err);

        graphModel.reflect(business, {
          _id: business._id,
          name: business.name,
          type: business.type,
          creator: business.creator,
          lat: body_business.location.lat,
          lon: body_business.location.lng
        }, function (err, business) {

          if (err) return handleError(res, err);
          if(business.type === 'PERSONAL_SERVICES' ||  business.type ===  'SMALL_BUSINESS')
            graphModel.relate_ids(creator._id, 'OWNS', business._id, function(err){
              if(err) console.log(err);
              graphModel.owner_followers_follow_business(user._id);
            });

          if (defined(business.shopping_chain))
            graphModel.relate_ids(business._id, 'BRANCH_OF', business.shopping_chain);

          if (defined(business.mall))
            graphModel.relate_ids(business._id, 'IN_MALL', business.mall);

          spatial.add2index(business.gid, function (err, result) {
            if (err) logger.error(err.message);
            else logger.info('object added to layer ' + result)
          });
          activity.activity({
            business: business._id,
            actor_user: business.creator,
            action: 'created'
          }, function (err) {
            if (err) console.error(err.message)
          });
          return res.status(201).json(business);
        });
      });
    });
  });
};

// Updates an existing business in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Business.findById(req.params.id, function (err, business) {
    if (err) {
      return handleError(res, err);
    }
    if (!business) {
      return res.status(404).send('Not Found');
    }
    let updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroy = function (req, res) {
  Business.findById(req.params.id, function (err, business) {
    if (err) {
      return handleError(res, err);
    }
    if (!business) {
      return res.status(404).send('Not Found');
    }
    business.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

