'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const async = require('async');
const User = require('./user.model');
const Business = require('../business/business.model');
const BusinessController = require('../business/business.controller');
const ShoppingChain = require('../shoppingChain/shoppingChain.model');
const Mall = require('../mall/mall.model');
const Group = require('../group/group.model');
const Instance = require('../instance/instance.model');
const PhoneNumber = require('../phone_number/phone_number.model');
const config = require('../../config/environment');
const jwt = require('jsonwebtoken');
const twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
const utils = require('../../components/utils').createUtils();
const randomstring = require('randomstring');
const logger = require('../../components/logger').createLogger();
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('user');

const activity = require('../../components/activity').createActivity();
const MongodbSearch = require('../../components/mongo-search');
const Role = require('../../components/role');
const feed = require('../../components/feed-tools');
const path = require('path');
const countryCode = require('../../components/counrtycode');
const suggest = require('../../components/suggest');
const fireEvent = require('../../components/firebaseEvent');

exports.search = MongodbSearch.create(User);


let validationError = function (res, err) {
  let firstKey = getKey(err.errors);
  if (firstKey !== undefined) {
    return res.status(422).json(err.errors.firstKey ? err.errors.firstKey.message : err.message);
  }
  return res.status(422).json(err);
};

function getKey(data) {
  for (let prop in data)
    if (data.propertyIsEnumerable(prop))
      return prop;
}

exports.terms = function (req, res) {
  if(req.params.ver === '1.0')
    return res.sendFile(path.join(__dirname, '../../config/terms/Terms Of Service.htm'));
  return res.status(404).send('Not Found');
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  User.find({}, '-salt -hashedPassword -sms_code', function (err, users) {
    if (err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

let generate_follow = function (userId, itemId) {
  async.parallel({
      user: function (callback) {
        User.findById(itemId, callback);
      },
      business: function (callback) {
        Business.findById(itemId, callback);
      },
      group: function (callback) {
        Group.findById(itemId, callback);
      },
      shoppingChain: function (callback) {
        ShoppingChain.findById(itemId, callback);
      },
      mall: function (callback) {
        Mall.findById(itemId, callback);
      }
    },
    function (err, results) {
      // results is now equals to: {one: 1, two: 2}
      if (results.user)               {
        graphModel.relate_ids(userId, 'FOLLOW', itemId, function (err) {
          if(err) return console.error(err);
          activity_follow(userId, {user: results.user._id})
        })
      }
      else if( results.business )     {
        BusinessController.followBusiness(userId, results.business._id, (err)=>{
          if(err) return console.error(err);
          fireEvent.info('business', results.business._id, 'business_user_follow', {
            userId,
            businessId : results.business._id
          });
          fireEvent.info('user', userId, 'business_user_follow', {
            userId,
            businessId : results.business._id
          });
          activity_follow(userId, {business: results.business._id})
        });
      }
      else if( results.group )        {
        graphModel.relate_ids(userId, 'FOLLOW', itemId, function (err) {
          if(err) return console.error(err);
          fireEvent.info('group', results.group._id, 'group_user_follow', {
            userId,
            groupId : results.group._id
          });
          fireEvent.info('user', userId, 'group_user_follow', {
            userId,
            groupId : results.group._id
          });
          activity_follow(userId, {group: results.group._id})
        })
      }
      else if( results.shoppingChain ){
        graphModel.relate_ids(userId, 'FOLLOW', itemId, function (err) {
          if(err) return console.error(err);
          fireEvent.info('shoppingChain', results.shoppingChain._id, 'shoppingChain_user_follow', {
            userId,
            shoppingChainId : results.shoppingChain._id
          });
          fireEvent.info('user', userId, 'shoppingChain_user_follow', {
            userId,
            shoppingChainId : results.shoppingChain._id
          });
          activity_follow(userId, {shoppingChain: results.shoppingChain._id})
        });
      }
      else if( results.mall )         {
        graphModel.relate_ids(userId, 'FOLLOW', itemId, function (err) {
          if(err) return console.error(err);
          fireEvent.info('mall', results.mall._id, 'mall_user_follow', {
            userId,
            mall : results.mall._id
          });
          fireEvent.info('user', userId, 'mall_user_follow', {
            userId,
            mall : results.mall._id
          });
          activity_follow(userId, {mall: results.mall._id})
        })
      }
    });
};

/**
 * '/like/:id'
 *
 * MATCH (a:Person),(b:Person)
 * WHERE a.name = 'Node A' AND b.name = 'Node B'
 * CREATE (a)-[r:RELTYPE]->(b)
 * RETURN r
 *
 * MATCH (u { _id:'567747ea034cfc2d372b14e5' }), (b { _id:'567ea4b5adef97f106cd6f78' }) create (u)-[:LIKE]->(b)
 */
exports.like = function (req, res) {
  let userId = req.user._id;
  graphModel.relate_ids(userId, 'LIKE', req.params.id, function (err) {
    if(err) return handleError(res, err);
    generate_follow(userId, req.params.id);

    async.parallel({
        instance: function (callback) {
          Instance.findById(req.params.id, callback);
        }
      },
      function (err, results) {
        if(err) return console.log(err);
        if( results.instance ) {
          graphModel.relate_ids(userId, 'LIKE', results.instance.promotion._id, (err) => {})
        }
      });
  });
  return res.status(200).send(`like called for object ${req.params.id}  and user ${userId}`);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unlike = function (req, res) {
  let userId = req.user._id;
  graphModel.unrelate_ids(userId, 'LIKE', req.params.id, (err)=>{
    if(err) return handleError(res, err);
    async.parallel({
        instance: function (callback) {
          Instance.findById(req.params.id, callback);
        }
      },
      function (err, results) {
        if(err) return console.log(err);
        if( results.instance ) {
          graphModel.unrelate_ids(userId, 'LIKE', results.instance.promotion._id, (err) => {})
        }
      });
  });
  return res.status(200).send("unlike called for " + req.params.id + " and user " + userId);
};

exports.share = function (req, res) {
  let userId = req.user._id;
  logger.info("share called for object " + req.params.id + " and user " + userId);
  graphModel.relate_ids(userId, 'SHARE', req.params.id, {timestamp: Date.now()});
  activity.action_activity(userId, req.params.id, 'share');
  return res.json(200, "share called for object " + req.params.id);
};

exports.save = function (req, res) {
  let userId = req.user._id;
  graphModel.relate_ids(userId, 'SAVE', req.params.id);
  //activity.action_activity(userId, req.params.id, 'saved');
  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

exports.follow = function (req, res) {
  let userId = req.user._id;
  generate_follow(userId, req.params.id);
  return res.status(200).json("like called for object " + req.params.id + " and user " + userId);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unfollow = function (req, res) {
  let userId = req.user._id;
  graphModel.unrelate_ids(userId, 'FOLLOW', req.params.id);
  return res.status(200).json("unlike called for promotion " + req.params.id + " and user " + userId);
};


function send_sms_verification_code(user) {
  send_sms_message(user.phone_number,
    "THIS code " + user.sms_code
  );
}


function send_sms_new_password(phone_number, new_password) {
  send_sms_message(phone_number,
    "THIS new password " + new_password
  );
}

function send_sms_message(phone_number, message) {
  twilio.messages.create({
    body: message,
    to: phone_number,
    from: config.twilio.number
  }, function (err, message) {
    if (err)
      console.log("failed to send sms verification err: " + err.message);
    else
      console.log("sms verification sent sid: " + message.sid);
  });
}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  let newUser = new User(req.body);
  newUser.created = Date.now();
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.sms_code = randomstring.generate({length: 4, charset: 'numeric'});
  newUser.country_code = newUser.country_code.toString().replace(/^[+]+/g,'');
  newUser.shortPhoneNumber = newUser.phone_number;
  newUser.phone_number = countryCode.validateNormalize(newUser.phone_number, newUser.country_code);
  if(!newUser.phone_number) {
    console.error(`validateNormalize number is null ${newUser.country_code}-${newUser.phone_number}`);
    return res.status(500).send();
  }
  User.findOne({phone_number: newUser.phone_number}, function (err, user) {
    if (user) {
      // let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
      // res.status(200).json({token: token});
      res.status(200).json('user already exist');
    } else {
      newUser.save(function (err, user) {
        if (err) return validationError(res, err);
        graphModel.reflect(user,
          {
            _id: user._id,
            phone: user.phone_number
          }, function (err) {
            if (err) return res.send(500, err);
            let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
            if (config.sms_verification) {
              send_sms_verification_code(user);
            }

            activity.activity({
              user: user,
              action: "welcome",
              actor_user: user,
              sharable: true,
              audience: ['SELF']
            }, function (err) {
              if (err) logger.error(err.message)
            });
            res.status(200).json({token: token});
          });
      });
    }
  });
};

/**
 *
 * @param req
 * @param res
 * @returns {*}
 * {
 *  "phonebook" : [
 *      {
 *         "normalized_number" : "+972-54-3333-333",
 *         "number": " 0543333333",
 *         "name" : "mr 3" ,
 *         "email" : "mr3@low.la"
 *
 *      },
 *      {
 *         "normalized_number" : "+972-54-2222-222",
 *         "number": " 0542222222",
 *         "name" : "mr 2" ,
 *         "email" : "mr2@low.la"
 *      }
 *  ]
 * }
 * ContactsContract.CommonDataKinds.Email
 * class  ContactsContract.CommonDataKinds.Nickname
 * class  ContactsContract.CommonDataKinds.Phone
 */
exports.phonebook = function (req, res) {
  const phonebook = req.body;
  const userId = req.user._id;
  User.findById(userId).exec((err, user) =>{
    if (err) return handleError(res, err);
    if(!user) return res.status(404).send(`user not found`);

    mongoose.connection.db.collection('phonebooks', function (err, collection) {
      if (err) return handleError(res, err);
      collection.save({
        _id: userId,
        phonebook: phonebook.phonebook
      }, function (err) {
        if (err) return handleError(res, err);
        //TODO: implement this way http://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
        //For each phone number store the users that has it in their phonebook
        mongoose.connection.db.collection('phonenumbers', function (err, collection) {
          if (err) return logger.error(err.message);
          phonebook.phonebook.forEach(contact => {
            if (utils.defined(contact.normalized_number) && utils.defined(contact.name)) {

              const valid_phone_number = countryCode.validateNormalize(contact.normalized_number, user.country_code);
              if(valid_phone_number === null)
                return;

              collection.findAndModify(
                {_id: valid_phone_number},
                [['_id', 'asc']],
                {
                  $addToSet: {
                    contacts: {
                      userId: `${userId}`,
                      nick: contact.name
                    }
                  }
                },
                {upsert: true, new: true},
                function (err, object) {
                  if (err) {
                    console.error(err.message);
                  } else {
                    let phone_number = object.value;
                    if (utils.defined(phone_number.owner)) {
                      //console.log(`phonebook follow_user: ${phone_number._id} ${userId}`);
                      graphModel.follow_user_by_phone_number(phone_number._id, userId, function (err) {
                        if (err) return logger.error(err.message);
                        graphModel.owner_followers_follow_business(userId, phone_number.owner);
                      });
                    }
                  }
                });
            }
          });
          return res.status(200).send('phonebook received');
        });
      });
    });
  });
};

/**
 * if this users number exist in phone_numbers collection
 * then all users (ids in contacts) should be followed by him
 * @param user
 */
function new_user_follow(user) {
  console.log(`new_user_follow: ${user.phone_number}`);
 PhoneNumber.findOne({_id: user.phone_number}, function (err, phone_number) {
    if (err)
      return logger.error(err.message);

    if (!phone_number) {
      PhoneNumber.create({
        _id: user.phone_number,
        owner: user._id,
        updated: Date.now(),
        contacts: []
      }, function (err) {
        if (err) console.log(err);
        //TODO: Suggests who to follow (All entities)
      });
    } else {
      //We have this number, make user follow the users who have his number
      async.each(phone_number.contacts, (contactX, callback) => {
        //this line is redundant but solved some bug we could not understand since contact.userId was undefined value
        const contact = JSON.parse(JSON.stringify(contactX));
        graphModel.follow_user_by_phone_number(user.phone_number, contact.userId, err => {
          if(err) return callback(err);
          activity_follow(user._id, {user: contact.userId});
          callback(null)
        });
      },(err) => {
        if(err) console.error(err);
        graphModel.owner_followers_follow_business(user._id);
        phone_number.owner = user._id;
        phone_number.save();

      });
      //We have this number, make user follow the users who have his number
      // phone_number.contacts.forEach( (contactX) => {
      //   //this line is redundant but solved some bug we could not understand since contact.userId was undefined value
      //   const contact = JSON.parse(JSON.stringify(contactX));
      //   graphModel.follow_user_by_phone_number(user.phone_number, contact.userId);
      //   activity_follow(user._id, {user: contact.userId});
      // });
    }
  });
}

function activity_follow(follower, partial_activity) {
  partial_activity.action = 'follow';
  partial_activity.actor_user = follower;
  activity_follow.shareable = true;
  activity.activity(partial_activity, function (err) {
    if (err) {
      logger.error(err.message)
    }
  });
}

exports.login = function (req, res, next) {
  User.findOne({$or: [{email: {$eq: req.body.email}}, {phone_number: {$eq: req.body.phone_number}}]}, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (user) {
      let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
      res.status(200).json({token: token});
    }
  });
};

/**
 * Get a single user by id
 */
exports.show = function (req, res, next) {
  let userId = req.params.id;

  User.findById(userId, '-salt -hashedPassword -sms_code -firebase -provider -facebook -twitter -google -github',
    function (err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      feed.user_state(req.user._id, user, function (err, user) {
        if (err) return next(err);
        res.status(200).json(user);
      })
  });
};

/**
 * Get a single user by phone number
 */
exports.showByPhone = function (req, res, next) {
  let userPhoneNumber = req.params.phone_number;
  User.findOne({phone_number: userPhoneNumber}, '-salt -hashedPassword -sms_code -firebase -provider -facebook -twitter -google -github',
    function (err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      feed.user_state(req.user._id, user, function (err, user) {
        if (err) return next(err);
        res.status(200).json(user);
      })
  });
};

exports.recover_password = function (req, res) {
  let phone_number = req.params.phone_number;
  User.findOne({'phone_number': phone_number}, function (err, user) {
    if (err) return handleError(err);
    if(!user) return res.status(500).send(`could not find user for number ${phone_number}`);
    let new_password = randomstring.generate({length: 6, charset: 'alphanumeric'});
    user.password = new_password;
    user.save(function (err, user) {
      if (err) return validationError(res, err);
      let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
      send_sms_new_password(phone_number, new_password);
      res.status(200).json({token: token});
      //return res.send(200, "ok");
    })
  })
};

exports.refresh_token = function (req, res) {
  let token = jwt.sign({_id: req.user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
  res.status(200).json({token: token});
};

/**
 * code verification
 */
exports.verification = function (req, res) {
  let code = req.params.code;
  let userId = req.user._id;
  if (req.body._id) {
    return res.status(404).send('bad request _id in body not allowed');
  }
  User.findById(userId, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.status(404).send('Not Found');
    }

    if (config.sms_verification && user.sms_code !== code) {
      return res.status(401).send('Code not match userId ' + userId + ' user code ' + user.sms_code + ' received ' + code);
    }
    user.sms_verified = true;
    user.sms_code = '';
    user.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      PhoneNumber.findByIdAndUpdate(user.phone_number,
        {_id: user.phone_number, updated: Date.now(), owner: user._id},
        {upsert: true, new: true, runValidators: true},
        (err, number) => {
          if(err) return handleError(res, err);
          new_user_follow(user);
          suggest.businesses(user, (err, businesses) => {
            if(err) console.error(err);
            if(businesses) console.log(`suggesting businesses user ${user._id} businesses ${JSON.stringify(businesses)}`);

          });
          return res.status(200).send('user verified');
        }
      );

      // mongoose.connection.db.collection('phonenumbers', function (err, numbers) {
      //   if (err) return logger.error(err.message);
      //   console.log(`_id: ${user.phone_number}, updated: ${Date.now()}, {$set: {owner: ${user._id}}, {upsert: ${true}}`);
      //   numbers.update({_id: user.phone_number, updated: Date.now()}, {$set: {owner: user._id}}, {upsert: true});
      //   //if this users number exist in phonenumbers collection
      //   //then all users (ids in contacts) should be followed by him
      //   new_user_follow(user);
      //   return res.status(200).send('user verified');
      // });
    });
  });
};

exports.suggest_businesses = function(req, res) {
  let userId = req.user._id;
  suggest.findBusinesses(userId, (err, businesses)=>{
    if(err) return handleError(res, err);
    return res.status(200).json(businesses);
  });
};

/***
 * sends sms code
 */
exports.verify = function (req, res) {
  let userId = req.user._id;
  let sms_code = randomstring.generate({length: 4, charset: 'numeric'});
  User.findById(userId, function (err, user) {
    if (err) return handleError(res, err);
    if (!user) return res.status(401).send('Unauthorized');
    user.sms_verified = false;
    user.sms_code = sms_code;
    send_sms_verification_code(user);
    user.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json('verification sms sent');
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.send(500, err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  let userId = req.user._id;
  let oldPass = String(req.body.oldPassword);
  let newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Change users info
 */
exports.updateInfo = function (req, res, next) {
  //let userId = req.user._id;
  let newUser = req.body;
  let query = {'phone_number': req.body.phone_number};

  User.findOneAndUpdate(query, newUser, {upsert: true}, function (err, doc) {
    if (err) return res.status(500).send(err);
    return res.status(200).send("successfully saved");
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  let userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -sms_code', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).json('Unauthorized');
    res.status(200).json(user);
  });
};


exports.roles = function (req, res) {
  res.status(200).json(Role.Roles);
};

exports.addEntityUserRole = function (req, res) {
  Role.handleEntityUserRole('add', req, res);
};

exports.addEntityUserRoleByPhone = function (req, res) {
  User.findOne({ $and: [{phone_number: req.params.phone},
    {country_code: req.params.country_code}]}, function (err, user) {
    if (err) return handleError(res, err);
    if (!user) return res.status(404);
    req.params[user] = user._id;
    Role.handleEntityUserRole('add', req, res);
  })
};

exports.deleteEntityUserRole = function (req, res) {
  Role.handleEntityUserRole('delete', req, res);
};

exports.entityRoles = function (req, res) {
  return Role.entityRoles(req, res)
};

exports.getUserByPhone = function (req, res) {
  //country_code
  User.findOne({ phone_number: req.params.country_code + req.params.phone}, function (err, user) {
    if(err) return handleError(res, err);
    return res.status(200).json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
