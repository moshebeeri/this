'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var logger = require('../../components/logger').createLogger();
var User = require('../user/user.model');
var Group = require('../group/group.controller');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('business');
var spatial = require('../../components/spatial').createSpatial();
var location = require('../../components/location').createLocation();
var utils = require('../../components/utils').createUtils();
var activity = require('../../components/activity').createActivity();

exports.address2 = function (req, res) {
  location.address(req.body.address, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    //logger.info(data);
    if (data.results == 0)
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
  var userId = req.user._id;
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
  var body_business = req.body;
  var userId = req.user._id;

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    var creator = null;
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

      //console.log(body_business.location);
      Business.create(body_business, function (err, business) {
        if (err) return handleError(res, err);

        graphModel.reflect(business, {
          _id: business._id,
          name: business.name,
          creator: business.creator,
          lat: body_business.location.lat,
          lon: body_business.location.lng
        }, function (err, business) {
          if (err) return handleError(res, err);

          graphModel.db().relate(creator.gid, 'OWNS', business.gid, {}, function (err, relationship) {
            if (err) return handleError(res, err);
            logger.info('(' + relationship.start + ')-[' + relationship.type + ']->(' + relationship.end + ')');

            if (defined(business.shopping_chain))
              graphModel.relate_ids(business._id, 'BRANCH_OF', business.shopping_chain);

            if (defined(business.mall))
              graphModel.relate_ids(business._id, 'IN_MALL', business.mall);

            spatial.add2index(business.gid, function (err, result) {
              if (err) logger.error(err.message);
              else logger.info('object added to layer ' + result)
            });
          });
          activity.activity({
            business: business._id,
            actor_user: business.creator,
            action: 'created'
          }, function (err) {
            if (err) console.error(err.message)
          });
        });

        Group.create_group({
          add_policy: 'OPEN',
          entity_type: 'BUSINESS',
          entity: business._id,
          creator: req.user._id
        }, function (err, group) {
          if (err) {
            return handleError(res, err);
          }
          business.default_group = group.id;
          business.save(function (err) {
              if (err) return console.log("error: " + err)
            }
          );
          return res.status(201).json(business);
        });
      });
    });
  });
};


/*
 var updated = _.merge(business, req.body);
 updated.save(function (err) {
 if (err) {
 return handleError(res, err);
 }
 return res.status(200).json(business);
 });
 });
 */


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
    var updated = _.merge(business, req.body);
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

//router.post('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
// user[phone_number] and user[sms_verified]
//TODO: Fix this function!!!
exports.add_users = function (req, res) {
  Business.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }

    if (utils.defined(_.find(group.admins, req.user._id) && (group.add_policy === 'OPEN' || group.add_policy === 'CLOSE'))) {
      console.log(req.body.users);
      for (let user in req.body.users) {
        if (user !== Object.keys(req.body.users)[Object.keys(req.body.users).length - 1]) {
          user_follow_group(req.body.users[user], group, false, res);
        } else {
          user_follow_group(req.body.users[user], group, true, res);
        }
      }
    }
    else if (group.add_policy === 'REQUEST' || group.add_policy === 'ADMIN_INVITE' || group.add_policy === 'MEMBER_INVITE')
      return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
    else
      return res.status(404).send('Can not add users');
  });
};

function user_follow_group(user_id, group, isReturn, res) {
  graphModel.relate_ids(user_id, 'FOLLOW', group._id);
  user_follow_group_activity(group, user_id);
  if (isReturn) {
    return res.json(200, group);
  }
}

function user_follow_group_activity(group, user) {
  user_activity({
    group: group,
    action: "business_follow",
    actor_user: user
  });
}

function user_activity(act) {
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

exports.following_user = function (req, res) {
  console.log("user_following_groups");
  console.log("user: " + req.user._id);
  var userId = req.user._id;
  console.log("MATCH (u:user {_id:'" + userId + "'})-[r:OWNS]->(b:business) RETURN b LIMIT 25");
  graphModel.query("MATCH (u:user {_id:'" + userId + "'})-[r:OWNS]->(b:business) RETURN b LIMIT 25", function (err, groups) {
    if (err) {
      return handleError(res, err)
    }
    if (!groups) {
      return res.send(404);
    }
    console.log(JSON.stringify(groups));
    return res.status(200).json(groups);
  });
};


function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

