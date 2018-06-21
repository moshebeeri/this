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
const Role = require('../../components/role');
const randomstring = require("randomstring");
const email = require('../../components/email');
const geolib = require('geolib');
const fireEvent = require('../../components/firebaseEvent');
const suggest = require('../../components/suggest');
const config = require('../../config/environment');
//const Promise = require('bluebird');
exports.search = MongodbSearch.create(Business);
const cardController = require('../card/card.controller');

function get_businesses_state(businesses, userId, callback) {
  feed.generate_state(businesses, userId, feed.business_state, callback)
}

exports.test_email = function (req, res) {
  email.send('reviewResultBusiness',
    'moshe@low.la', {
      serverURL: config.serverURL,
      name: 'moshe',
      businessName: 'business_name',
      accepted: false,
      businessId: 'business._id',
      reason: 'business.reason'
    }, function (err) {
      if (err) console.error(err);
      return res.status(200).send();
    })
};
exports.address2 = function (req, res) {
  location.address(req.body.address, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    //logger.info(data);
    if (data.results === 0)
      return res.status(400).send('No location under this address : ' + req.body.address);
    if (data.results.length > 1)
      return res.status(400).send('Inconsistent address, google api find more then one location under this address: ' + req.body.address);
    logger.info("lat:" + data.results[0].geometry.location.lat);
    logger.info("lng:" + data.results[0].geometry.location.lng);
    return res.status(200).send();
  });
};
exports.coordinates = function (req, res) {
  location.getReverseGeocodingData(req.params.lat, req.params.lng)
    .then(address => res.status(200).json(address))
    .catch(e => handleError(res, e));
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

function getUserBusinesses(userId, includeSellers, callback) {
  let roles = includeSellers ? "['OWNS', 'Admin', 'Manager', 'Seller']" : "['OWNS', 'Admin', 'Manager']";
  let query = `MATCH (user:user{_id:"${userId}"})-[role:ROLE]->(b:business) 
               WHERE role.name IN ${roles}
               return b._id as business_id, role
               order by business_id desc`;
  graphModel.query(query, function (err, businesses_role) {
    if (err) return callback(err);
    let _ids = [];
    let userRoleById = {};
    businesses_role.forEach(business_role => {
      _ids.push(business_role.business_id);
      userRoleById[business_role.business_id] = business_role.role.properties.name;
    });
    Business.find({}).where({$or: [{_id: {$in: _ids}}, {$and: [{creator: userId}, {'review.status': 'waiting'}]}]})
      .sort('-_id')
      .exec(function (err, businesses) {
        if (err) return callback(err);
        get_businesses_state(businesses, userId, function (err, businesses) {
          if (err) return callback(err);
          let info = [];
          businesses.forEach(business => {
            info.push({
              business: business,
              role: userRoleById[business._id]
            });
          });
          return callback(null, info);
        })
      });
  })
}

exports.followers = function (req, res) {
  let business = req.params.business;
  let skip = req.params.skip;
  let limit = req.params.limit;
  let query = graphModel.paginate_query(`MATCH (:business {_id:'${business}'})<-[:FOLLOW]-(follower)
                                        WHERE follower:user or follower:group 
                                        RETURN follower._id as _id, labels(follower)[0] as label`, skip, limit);
  graphModel.query_objects_parallel({group: Group, user: User}, query,
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    });
};

exports.mine = function (req, res) {
  let userId = req.user._id;
  getUserBusinesses(userId, true, (err, info) => {
    if (err) return handleError(res, err);
    return res.status(200).json(info);
  });
};

exports.getUserBusinessesByPhone = function (req, res) {
  User.findOne({
    $and: [{phone_number: req.params.phone},
      {country_code: req.params.country_code}]
  }, function (err, user) {
    if (err) return handleError(res, err);
    getUserBusinesses(user._id, false, (err, info) => {
      if (err) return handleError(res, err);
      return res.status(200).json({user, info});
    });
  });
};

function business_follow_activity(follower, business) {
  activity.activity({
    business,
    actor_user: follower,
    action: 'follow',
    sharable: true
  }, function (err) {
    if (err) console.error(err.message)
  });
}

function addToLoyaltyCard(userId, businessId, callback) {
  const query = `MATCH (e{_id:'${businessId}'})-[:LOYALTY_CARD]->(cardType:cardType) return cardType._id as _id`;
  graphModel.query(query, (err, cardTypes) => {
    if(err) return callback(err);
    if(cardTypes.length !== 1) return callback(new Error(`unexpected cardTypes.length`));
    cardController.createCard(userId, cardTypes[0]._id, (err, card) => {
      if (err) { return callback(err); }
      return callback(null, card);
    });
  });
}

function doFollowBusiness(userId, businessId, callback) {
  Business.findById(businessId)
    .exec(function (err, business) {
      if (err) return console.error(err);
      graphModel.is_related_ids(userId, 'FOLLOW', businessId, function (err, exist) {
        if (err) return callback(err);
        if (exist) return callback(null); //new Error('user already follows');
        graphModel.is_related_ids(userId, 'UN_FOLLOW', businessId, function (err, unFollowExist) {
          if (err) return callback(err);
          graphModel.relate_ids(userId, 'FOLLOW', businessId, function (err) {
            suggest.promotionsToNewBusinessFollower(businessId, userId, (err, results) => {
            });
            if (err) return callback(err);
            if (unFollowExist) return callback(null);
            //first time follow
            business_follow_activity(userId, businessId);
            let query = `MATCH (user:user{_id:"${userId}"}), (b:business{_id:"${businessId}"})-[d:DEFAULT_GROUP]->(g:group) 
                         CREATE UNIQUE (user)-[f:FOLLOW]->(g)
                         return user._id as userId, g._id as groupId
                         `;
            graphModel.query(query, function (err, results) {
              if (err) return callback(err);
              onAction.follow(userId, businessId);
              fireEvent.info('business', businessId, 'follow_business', {status: business.review.status});
              if (business.shopping_chain) {
                return graphModel.relate_ids(userId, 'FOLLOW', businessId, callback)
              }
              results.forEach(user_group => {
                fireEvent.info('user', user_group.userId, 'group_user_follow', {
                  userId: user_group.userId,
                  groupId: user_group.groupId
                });
              });
              addToLoyaltyCard(userId, businessId, (err) => {if(err) console.error(err)});
              return callback(null)
            })
          });
        })
      });
    });
}

exports.followBusiness = function (userId, businessId, callback) {
  return doFollowBusiness(userId, businessId, callback)
};
exports.follow = function (req, res) {
  let userId = req.user._id;
  let businessId = req.params.business;
  doFollowBusiness(userId, businessId, function (err) {
    if (err) return handleError(res, err);
    return res.status(200).send();
  })
};

function un_follow(userId, businessId, callback) {
  graphModel.unrelate_ids(userId, 'FOLLOW', businessId, function (err) {
    if (err) return callback(err);
    graphModel.relate_ids(userId, 'UN_FOLLOW', businessId, function (err) {
      if (err) return callback(err);
      let query = `MATCH (user:user{_id:"${userId}"})-[f:FOLLOW]->(g:group)<-[d:DEFAULT_GROUP]-(b:business{_id:"${businessId}"}) delete f`;
      graphModel.query(query, function (err) {
        if (err) return callback(err);
        return callback(null);
      })
    })
  })
}

exports.un_follow = function (req, res) {
  let userId = req.user._id;
  let businessId = req.params.business;
  un_follow(userId, businessId, function (err) {
    if (err) return handleError(res, err);
    return res.status(200).send();
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
    business.groups.push(group._id);
    business.save((err) => {
      if (err) return console.error(err);
      graphModel.owner_followers_follow_default_group(business.creator._id, (err, results) => {
        if (err) return console.error(err);
        console.log(`graphModel.owner_followers_follow_default_group ${JSON.stringify(results)}`);
        results.forEach(user_group => {
          fireEvent.info('user', user_group.userId, 'user_follow_group', {
            userId: user_group.userId,
            groupId: user_group.groupId
          });
        });
      });
      //graphModel.relate_ids(business.creator._id, 'FOLLOW', group._id);
    });
  });
}

exports.check_address = function (req, res) {
  let address = req.body;
  location.address_location(address, function (err, data) {
    if (err) {
      if (err.code === 204)
        return res.status(err.code).json(err);
      else if (err.code === 202) {
        return res.status(202).json(data);
      }
      else {
        return res.status(400).json(err);
      }
    } else {
      return res.status(200).json(data);
    }
  })
};

function sendValidationEmail(businessId) {
  Business.findById(businessId).exec((err, business) => {
    if (err) return console.error(err);
    if (!business) return console.error(new Error('Business not found'));
    email.send('validateBusinessEmail',
      business.email, {
        serverURL: config.serverURL,
        name: business.creator.name,
        businessName: business.name,
        businessId: business._id,
        validationCode: business.validationCode,
        code: business.validationCode
      }, function (err) {
        if (err) console.error(err);
      });
  });
}

function reviewRequest(business) {
  email.send('reviewBusiness', 'THIS@low.la', {
    serverURL: config.serverURL,
    name: 'Dear Reviewer',
    businessEmail: business.email,
    businessName: business.name,
    businessId: business._id,
    address: business.address,
    address2: business.address2,
    city: business.city,
    country: business.country,
    category: business.category,
    subcategory: business.subcategory,
    state: business.state,
    main_phone_number: business.main_phone_number,
    email: business.email,
    letterOfIncorporation: `http://${config.serverURL}/api/businesses/letterOfIncorporation/${business._id}`,
    identificationCard: `http://${config.serverURL}/api/businesses/identificationCard/${business._id}`,
  }, function (err) {
    if (err) console.error(err);
  });
}

function getBusinessDocument(type, req, res) {
  const businessId = req.params.id;
  Business.findById(businessId)
    .exec((err, business) => {
      if (err) return handleError(res, err);
      if (business.review.state === 'reviewed')
        return handleError(res, new Error('already reviewed'));
      let documentUrl = type === 'letter' ? business.letterOfIncorporation : business.identificationCard;
      res.setHeader('content-type', 'text/html');
      return res.status(200).send(`<html><body><img src="${documentUrl}"/></body></html>`);
    })
}

exports.letterOfIncorporation = function (req, res) {
  return getBusinessDocument('letter', req, res)
};
exports.identificationCard = function (req, res) {
  return getBusinessDocument('id', req, res)
};

function createValidatedBusiness(business, callback) {
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
      phone: business.phone,
      type: business.type,
      creator: business.creator._id,
      lat: business.location.lat,
      lon: business.location.lng
    }, function (err, business) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      Role.createRole(business.creator._id, business._id, Role.Roles.get('OWNS'), function (err) {
        if (err) return callback(err);
        graphModel.relate_ids(business.creator._id, 'FOLLOW', business._id);
        if (business.type === 'PERSONAL_SERVICES' || business.type === 'SMALL_BUSINESS') {
          graphModel.owner_followers_follow_business(business.creator._id);
        }
        if (defined(business.shopping_chain))
          graphModel.relate_ids(business._id, 'BRANCH_OF', business.shopping_chain._id);
        if (defined(business.mall))
          graphModel.relate_ids(business._id, 'IN_MALL', business.mall._id);
        spatial.add2index(business.gid, function (err /*, result*/) {
          if (err) return console.error(err);
        });
        activity.activity({
          business: business._id,
          actor_user: business.creator._id,
          action: 'created',
          sharable: true
        }, function (err) {
          if (err) return console.error(err);
        });
        create_business_default_group(business);
        notifyOnAction(business);
        return callback(null, business);
      });
    });
  })
}

function sendRejectEmail(business) {
  email.send('reviewResultBusiness',
    business.email, {
      serverURL: config.serverURL,
      name: business.creator.name,
      businessName: business.name,
      accepted: business.review.result === 'accepted',
      businessId: business._id,
      reason: business.review.reason
    }, function (err) {
      if (err) console.error(err);
    });
}

function review(businessId, status, callback) {
  Business.findById(businessId).exec((err, business) => {
    if (err) return callback(err);
    if (!business) return callback(null, null);
    if (business.review.state === 'reviewed') return callback('already reviewed');
    business.review.state = 'reviewed';
    if (status === 'accepted') {
      business.review.result = 'accepted';
      let create_business = false;
      if (!business.review.created) {
        business.review.created = true;
        create_business = true;
      }
      business.save((err, business) => {
        if (err) return callback(err);
        if (create_business) {
          createValidatedBusiness(business, (err, business) => {
            if (err) {
              console.error(err);
              return callback(err);
            }
            return callback(null, business);
          });
        } else {
          return callback(null, business);
        }
      });
    } else {
      business.review.result = 'rejected';
      business.save(err => {
        if (err) return callback(err);
        return sendRejectEmail(business);
      });
    }
  })
}

exports.review = function (req, res) {
  const businessId = req.params.id;
  const status = req.params.status;
  review(businessId, status, (err, business) => {
    if (err) return res.status(400).send(err);
    if (!business) return res.status(404).send('Not Found');
    fireEvent.info('business', businessId, 'review', {status: business.review.status});
    return res.status(201).json(business);
  })
};

function validate_email(businessId, validationCode, callback) {
  Business.findById(businessId).exec((err, business) => {
    if (err) return callback(err);
    if (!business) return callback(null, null);
    if (business.validationCode !== validationCode)
      return callback(new Error('Validation codes mismatch'));
    business.validationCode = '';
    business.review.state = 'review';
    business.save(err => {
      if (err) callback(err);
      if (business.review.status !== 'reviewed') {
        reviewRequest(business);
      }
      fireEvent.info('business', businessId, 'validate_email', {status: business.review.status});
      return callback(null, business);
    });
  })
}

function approveBusiness(business, callback) {
  review(business._id, 'accepted', (err, business) => {
    if (err) return callback(err);
    if (!business) return callback(null, null);
    fireEvent.info('business', approveBusiness, 'review', {status: business.review.status});
    return callback(null, business);
  })
}

// post '/agent/approve/:business/:code'
exports.agent_approve_business = function (req, res) {
  const businessId = req.params.business;
  const user = req.user;
  const code = req.params.code;
  const agent_coordinates = req.body;
  if (user.agent.code === code) {
    Business.findById(businessId).exec((err, business) => {
      if (err) return handleError(res, err);
      if (business.creator._id === user._id)
        return handleError(res, new Error(`Agent can't approve business that he created`));
      //check distance of agent from business
      if (geolib.getDistance(
          agent_coordinates,
          {latitude: business.location.lat, longitude: business.location.lng}
        ) > 500)
        return handleError(res, new Error(`Agent should be in proximity to business in order to approve it`));
      approveBusiness(business, (err, business) => {
        if (err) return handleError(res, err);
        if (!business) return res.status(404).send('Not Found');
        return res.status(201).json(business);
      })
    })
  }
  else
    return handleError(res, new Error(`Usr is not an agent`));
};
exports.validate_email = function (req, res) {
  const businessId = req.params.id;
  const validationCode = req.params.code;
  validate_email(businessId, validationCode, (err, business) => {
    if (err) return handleError(res, err);
    if (!business) return res.status(404).send('Not Found');
    return res.status(201).send('email verified successfully');
  })
};

function update_email(businessId, newEmail, callback) {
  Business.findById(businessId).exec((err, business) => {
    if (err) return callback(err);
    if (!business) return callback(new Error('Not Found'));
    business.email = newEmail;
    business.validationCode = randomstring.generate({length: 12, charset: 'numeric'});
    business.review.status = 'waiting';
    business.review.state = 'validation';
    business.save((err, business) => {
      if (err) return callback(err);
      sendValidationEmail(business._id);
      callback(null, business)
    });
  });
}

exports.update_email = function (req, res) {
  const businessId = req.params.id;
  const newEmail = req.params.email;
  update_email(businessId, newEmail, (err, business) => {
    if (err) return handleError(res, err);
    return res.status(201).json(business);
  })
};
exports.create = function (req, res) {
  let body_business = req.body;
  let userId = req.user._id;
  body_business.creator = userId;
  body_business.validationCode = randomstring.generate({length: 12, charset: 'numeric'});
  body_business.review = {
    status: 'waiting',
    result: 'waiting',
    state: 'validation',
    reason: ''
  };

  function createBusiness() {
    location.address_location(body_business, function (err, data) {
      if (err) {
        console.error(err);
        if (err.code >= 400) return res.status(err.code).send(err.message);
        else if (err.code === 202) {
          console.error(err);
          return res.status(202).json(data);
        }
        else return res.status(400).send(err);
      }
      body_business.location = spatial.geo_to_location(data);
      User.findById(body_business.creator)
        .select('phone_number')
        .exec((err, user) => {
          if (err) return handleError(res, err);
          body_business.main_phone_number = user.phone_number;
          Business.create(body_business, function (err, business) {
            if (err) return handleError(res, err);
            sendValidationEmail(business._id);
            return res.status(201).json(business);
          });
        });
    });
  }

  function userRole(userId, business, callback) {
    if (business.shopping_chain || business.mall) {
      let entityId = business.shopping_chain ? business.shopping_chain : business.mall;
      return Role.getUserEntityRole(userId, entityId, callback);
    }
    return callback(null, Role.Roles.get('OWNS'));
  }

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    userRole(user._id, body_business, function (err, role) {
      if (err) return handleError(res, err);
      if (role < Role.Roles.get('Admin')) return res.status(401).send(`Insufficient permission level ${role}`);
      body_business.creator = userId;
      body_business.created = Date.now();
      return createBusiness();
    });
  });
};

function notifyOnAction(business) {
  const notes = ['ADD_BUSINESS_FOLLOW_ON_ACTION',
    'ADD_BUSINESS_PROXIMITY_ON_ACTION'];
  notes.forEach(note => {
    try {
      Notifications.notify({
        note: note,
        business: business._id,
        actor_user: business.creator,
        timestamp: Date.now()
      }, [business.creator])
    } catch (err) {
      console.error(err)
    }
  })
}

exports.test = function (req, res) {
  // let checkPermitted = Promise.promisify(permitted);
  // checkPermitted(req.params.user, req.params.entity)
  permitted2(req.params.user, req.params.entity)
    .then(has => res.status(200).json(has))
    .catch(e => handleError(res, e));
  // permitted(req.params.user, req.params.entity, (err, has)=>{
  //   if(err) handleError(res, err);
  //   return res.status(200).json(has);
  // })
};

function permitted(userId, businessId, callback) {
  Business.findById(businessId).exec((err,business) => {
    if (err) return callback(err);
    //update before business established
    if(!business.gid) {
      if(business.creator._id.toString() === userId.toString())
        return callback(null, true);
      else
        return callback(null, false);
    }
    const entityId =  business._id;
    const query = `MATCH (u:user{_id:'${userId}'})-[r:ROLE]->(e{_id:'${entityId}'}) where r.name in ['OWNS','Admin'] RETURN count(r)>0 as has`;
    graphModel.query(query, (err, results) => {
      if (err) return callback(err);
      if (results.length !== 1) return callback(new Error('unexpected result length'));
      return callback(null, results[0].has)
    })
  })
}

function permitted2(userId, entityId) {
  return new Promise(function (resolve, reject) {
    const query = `MATCH (u:user{_id:'${userId}'})-[r:ROLE]->(e{_id:'${entityId}'}) where r.name in ['OWNS','Admin'] RETURN count(r)>0 as has`;
    graphModel.query(query, (err, results) => {
      if (err) return reject(err);
      if (results.length !== 1) return reject(new Error('unexpected result length'));
      return resolve(results[0].has)
    });
  });
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
    permitted(req.user._id, business, (err, hasPermissions) => {
      if (err) return handleError(res, err);
      if (!hasPermissions) return res.status(401).json(`user not permitted`);

      function update_location(updated, current, callback) {
        if (updated.country !== current.country ||
          updated.city !== current.city ||
          updated.address !== current.address ||
          updated.address2 !== current.address2 ||
          updated.country !== current.country ||
          !updated.location ||
          updated.location.lng !== current.location.lng ||
          updated.location.lat !== current.location.lat) {
          location.address_location(updated, function (err, data) {
            if (err) {
              console.error(err);
              if (err.code >= 400) return res.status(err.code).send(err.message);
              else if (err.code === 202) {
                console.error(err);
                return res.status(202).json(data);
              }
              else return res.status(400).send(err);
            }
            updated.location = spatial.geo_to_location(data);
            return callback(null);
          })
        } else {
          return callback(null);
        }
      }

      let should_validate_email = false;
      if (req.body.email && req.body.email !== business.email)
        should_validate_email = true;
      let updated = _.merge(business, req.body);
      update_location(updated, business, err => {
        if (err) return handleError(res, err);
        updated.save(function (err, business) {
          if (err) {
            return handleError(res, err)
          }
          if (should_validate_email)
            update_email(business, business.email, (err) => {
              if (err) return console.error(err);
            });
          return res.status(200).json(business);
        });
      });
    });
  })
};
exports.update_pictures = function (req, res) {
  permitted(req.user._id, req.params.id, (err, hasPermissions) => {
    if (err) return handleError(res, err);
    if (!hasPermissions) return res.status(401).json(`user not permitted`);
    Business.findById(req.params.id, function (err, business) {
      business.pictures = req.body;
      business.save((err, business) => {
        if (err) return handleError(res, err);
        return res.status(200).json(business);
      })
    });
  })
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
  console.error(err);
  return res.status(500).send(err);
}

