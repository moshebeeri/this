'use strict';

const _ = require('lodash');
const Business = require('./business.model');
const logger = require('../../components/logger').createLogger();
const User = require('../user/user.model');
const Group = require('../group/group.model');
const Notifications = require('../../components/notification');
const onAction = require('../../components/on-action');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('business');
const spatial = require('../../components/spatial').createSpatial();
const location = require('../../components/location').createLocation();
const utils = require('../../components/utils').createUtils();
const activity = require('../../components/activity').createActivity();
const group_controller = require('../group/group.controller');
const MongodbSearch = require('../../components/mongo-search');
const qrcodeController = require('../qrcode/qrcode.controller');
const feed = require('../../components/feed-tools');

function get_businesses_state(businesses, userId, callback) {
  feed.generate_state(businesses, userId, feed.business_state, callback)
}

exports.search = MongodbSearch.create(Business);

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
  Business.find(function (err, businesses) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(businesses);
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

    get_businesses_state([business], req.user._id, function (err, businesses) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(businesses[0]);
    })
  });
};

exports.mine = function (req, res) {
  let userId = req.user._id;
  let query = `MATCH (user:user{_id:"${userId}"})-[role:ROLE]->(b:business) return b._id as business_id, role
                order by business_id desc`;

  graphModel.query(query, function (err, businesses_role) {
    if (err) return handleError(res, err);
    let _ids = [];
    let userRoleById = {};
    businesses_role.forEach(business_role => {
      _ids.push(business_role.business_id);
      userRoleById[business_role.business_id] = business_role.role.properties.name;
    });
    Business.find({}).where('_id').in(_ids)
      .sort({_id: 'desc'})
      .exec(function (err, businesses) {
        if (err) return handleError(res, err);
        get_businesses_state(businesses, req.user._id, function (err, businesses) {
          if (err) return handleError(res, err);

          let info = [];
          businesses.forEach(business => {
            info.push({
              business: business,
              role: userRoleById[business._id]
            });
          });
          return res.status(200).json(info);
        })
      });
  })
};

function business_follow_activity(follower, business) {
  activity.activity({
    business: business,
    actor_user: follower,
    action: 'follow'
  }, function (err) {
    if (err) console.error(err.message)
  });
}

function follow(userId, businessId, callback) {
  let query = `MATCH (user:user{_id:"${userId}"})-[f:FOLLOW]->(b:business{_id:"${businessId}"}) return count(f)`;
  graphModel.query(query, function (err, count) {
    if (err) return callback(err);
    if (count > 0) return callback(new Error('user already follows'));
    graphModel.relate_ids(userId, 'FOLLOW', businessId, function (err) {
      business_follow_activity(userId, businessId);
      let query = `MATCH (b:business{_id:"${businessId}"})-[d:DEFAULT_GROUP]->(g:group) 
                    CREATE UNIQUE (user:user{_id:"${userId}"})-[f:FOLLOW]->(g)`;
      graphModel.query(query, function (err) {
        if (err) return callback(err);
        onAction.follow(userId, businessId);
      })
    })
  })
}

exports.follow = function (req, res) {
  let userId = req.user._id;
  let businessId = req.params.business;
  follow(userId, businessId, function (err) {
    if (err) return handleError(res, err);
    return res.status(200);
  })
};

exports.following_users = function (req, res) {
  let businessId = req.params.business;
  let paginate = utils.to_paginate(req);
  let query = `MATCH (user:user)-[f:FOLLOW]->(b:business{_id:"${businessId}"}) RETURN user._id as _id`;
  graphModel.query_objects(User, query,
    'order by _id DESC', paginate.skip, paginate.limit, function (err, users) {
      if (err) {
        return handleError(res, err)
      }
      if (!users) {
        return res.send(404)
      }
      return res.status(200).json(users);
    });
};

exports.following_groups = function (req, res) {
  let businessId = req.params.business;
  let paginate = utils.to_paginate(req);
  let query = `MATCH (group:group)-[f:FOLLOW]->(b:business{_id:"${businessId}"}) RETURN group._id as _id`;
  graphModel.query_objects(Group, query,
    'order by _id DESC', paginate.skip, paginate.limit, function (err, groups) {
      if (err) {
        return handleError(res, err)
      }
      if (!groups) {
        return res.send(404)
      }
      return res.status(200).json(groups);
    });
};

exports.users_following_default_group = function (req, res) {
  let businessId = req.params.business;
  let paginate = utils.to_paginate(req);
  let query = `MATCH (user:user)-[:FOLLOW]->(:group)<-[:DEFAULT_GROUP]-(b:business{_id:"${businessId}"}) RETURN user._id as _id`;
  graphModel.query_objects(User, query,
    'order by _id DESC', paginate.skip, paginate.limit, function (err, users) {
      if (err) {
        return handleError(res, err)
      }
      if (!users) {
        return res.send(404)
      }
      return res.status(200).json(users);
    });
};

exports.groups_following_default_group = function (req, res) {
  let businessId = req.params.business;
  let paginate = utils.to_paginate(req);
  let query = `MATCH (groups:group)-[:FOLLOW]->(:group)<-[:DEFAULT_GROUP]-(b:business{_id:"${businessId}"}) RETURN groups._id as _id`;
  graphModel.query_objects(Group, query,
    'order by _id DESC', paginate.skip, paginate.limit, function (err, groups) {
      if (err) {
        return handleError(res, err)
      }
      if (!groups) {
        return res.send(404)
      }
      return res.status(200).json(groups);
    });
};

function defined(obj) {
  return utils.defined(obj);
}

function create_business_default_group(business) {
  group_controller.create_business_default_group({
    name: business.name,
    description: business.name + ' default group',
    creator: business.creator,
    created: Date.now(),
    admins: [business.creator],
    entity: {business: business._id},
    entity_type: 'BUSINESS',
    add_policy: 'OPEN',
    post_policy: 'MANAGERS',
  }, function (err, group) {
    if (err) return console.error(err.message);
    graphModel.owner_followers_follow_default_group(business.creator);
    console.log(`default group created successfully ${JSON.stringify(group)}`)
  });
}

exports.check_address = function (req, res) {
  location.address_location(req.body, function (err, data) {
    if (err) {
      if (err.code >= 400) return res.status(err.code).send(err.message);
      else if (err.code === 202) {
        console.log(err);
        return res.status(202).json(data);
      }
      else return res.status(400).send(err);
    }
    return res.status(200).json(data);
  })
};

exports.create = function (req, res) {
  let body_business = req.body;
  let userId = req.user._id;

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    body_business.creator = userId;
    body_business.created = Date.now();

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
        qrcodeController.createAndAssign(business.creator, {
          type: 'FOLLOW_BUSINESS',
          assignment: {
            business: business._id
          }
        }, function (err, qrcode) {
          business.qrcode = qrcode;
          business.save();
          graphModel.reflect(business, {
            _id: business._id,
            name: business.name,
            type: business.type,
            creator: business.creator,
            lat: body_business.location.lat,
            lon: body_business.location.lng
          }, function (err, business) {

            if (err) return handleError(res, err);
            if (business.type === 'PERSONAL_SERVICES' || business.type === 'SMALL_BUSINESS') {
              let grunt_query = `MATCH (user:user{_id:"${user._id}"}), (entity{_id:"${business._id}"})
                     CREATE (user)-[role:ROLE{name:'OWNS'}]->(entity)`;

              graphModel.query(grunt_query, function (err) {
                if (err) console.log(err);
                graphModel.owner_followers_follow_business(user._id);
              });
            }

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
            create_business_default_group(business);
            notifyOnAction(business);
            return res.status(201).json(business);
          });
        })
      });
    });
  });
};

function notifyOnAction(business) {
  try {
    Notifications.notify({
      note: 'ADD_BUSINESS_FOLLOW_ON_ACTION',
      business: business.id,
      actor_user: business.creator,
      timestamp: Date.now()
    }, [business.creator])
  } catch (err) {
    console.error(err)
  }
}

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

