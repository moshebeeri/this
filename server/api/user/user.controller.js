'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var User = require('./user.model');

var PhoneNumber = require('../phone_number/phone_number.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
var util = require('util');

var utils = require('../../components/utils').createUtils();
var randomstring = require('randomstring');

var logger = require('../../components/logger').createLogger();
var graphTools = require('../../components/graph-tools');

var graphModel = graphTools.createGraphModel('user');
var activity = require('../../components/activity').createActivity();
var Business = require('../business/business.model');
var ShoppingChain = require('../shoppingChain/shoppingChain.model');
var Product = require('../product/product.model');
var Promotion = require('../promotion/promotion.model');
var Mall = require('../mall/mall.model');
var Activity = require('../activity/activity.model');

var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  User.find({}, '-salt -hashedPassword -sms_code', function (err, users) {
    if (err) return res.send(500, err);
    res.json(200, users);
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
  var userId = req.user._id;
  graphModel.relate_ids(userId, 'LIKE', req.params.id);
  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unlike = function (req, res) {
  var userId = req.user._id;
  graphModel.unrelate_ids(userId, 'LIKE', req.params.id);
  like_activity(userId, req.params.id);
  return res.json(200, "unlike called for promotion " + req.params.id + " and user " + userId);
};


function like_activity(userId, itemId) {
  var act = {
    actor_user: userId,
    action: "like"
  };

  async.parallel({
    user: function (callback) {
      User.findById(itemId, callback);
    },
    business: function (callback) {
      Business.findById(itemId, callback);
    },
    chain: function (callback) {
      ShoppingChain.findById(itemId, callback);
    },
    product: function (callback) {
      Product.findById(itemId, callback);
    },
    promotion: function (callback) {
      Promotion.findById(itemId, callback);
    },
    mall: function (callback) {
      Mall.findById(itemId, callback);
    }
  }, function (err, results) {
    for (var key in results) {
      if (!_.isUndefined(results[key])) {
        switch (key) {
          case 'user':
            act.user = itemId;
            break;
          case 'business':
            act.business = itemId;
            break;
          case 'chain':
            act.chain = itemId;
            break;
          case 'product':
            act.product = itemId;
            break;
          case 'promotion':
            act.promotion = itemId;
            break;
          case 'mall':
            act.mall = itemId;
            break;
        }
        activity.activity(act, function (err) {
          if (err) logger.error(err.message)
        });
      }
    }
  });
}


function send_sms_verification_code(user) {
  send_sms_message(user.phone_number,
    "Thank you for using ThisCounts your sms code is " + user.sms_code
  );
}

function send_sms_new_password(phone_number, new_password) {
  send_sms_message(phone_number,
    "ThisCounts new password " + new_password
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
  var newUser = new User(req.body);

  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.sms_code = randomstring.generate({length: 4, charset: 'numeric'});
  newUser.sms_verified = false;
  newUser.phone_number = utils.clean_phone_number(newUser.phone_number);
  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 24 * 30});
    res.json({token: token});

    send_sms_verification_code(user);

    graphModel.reflect(user,
      {
        _id: user._id,
        phone: user.phone_number
      }, function (err) {
        if (err) return res.send(500, err);
        //if this users number exist in phone_numbers collection
        //then all users (ids in contacts) should be followed by him
        new_user_follow(user)
      });
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
  var mongoose = require('mongoose');
  var phonebook = req.body;
  var userId = req.user._id;

  mongoose.connection.db.collection('phonebook', function (err, collection) {
    if (err) return logger.error(err.message);
    collection.save({
      _id: userId,
      phonebook: phonebook.phonebook
    });
    //TODO: implement this way http://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
    //for each phone number store the users that has it in their phone book

    mongoose.connection.db.collection('phone_numbers', function (err, collection) {
      if (err) return logger.error(err.message);
      phonebook.phonebook.forEach(function (contact, index, array) {
        console.log(JSON.stringify(contact));

        //collection.update({_id: element.normalized_number}, {$addToSet: {userIds: userId}}, {upsert: true});
        collection.findAndModify(
          {_id: utils.clean_phone_number(contact.normalized_number)},
          [['_id', 'asc']],
          {
            $addToSet: {
              contacts: {
                userId: userId,
                nick: contact.name
              }
            }
          },
          {upsert: true, new: true},
          function (err, object) {
            if (err) {
              console.warn(err.message);
            } else {
              console.dir(object);
              owner_follow(object.value)
            }
          });
      });
    });
  });
  return res.status(200).send("ok")
};


function owner_follow(phone_number) {
  if (!utils.defined(phone_number._id) || phone_number.contacts.length == 0)
    return;
  phone_number.contacts.forEach(function (contact) {
    graphModel.follow_phone(phone_number._id, contact.nick, contact.userId);
    logger.info('create (' + contact + ')<-[Follows]-(' + phone_number.owner + ')');
  });
}


/**
 * if this users number exist in phone_numbers collection
 * then all users (ids in contacts) should be followed by him
 * @param user
 */
function new_user_follow(user) {
  PhoneNumber.findById(user._id, function (err, phone_number) {
    if (err) {
      return logger.error(err.message);
    }
    if (!phone_number) return;
    //We have this number, make user follow the users who have his number
    phone_number.contacts.forEach(function (contact) {
      graphModel.follow_phone(contact.userId, contact.nick, user._id);
      activity_follow(user._id, contact.userId)
      logger.info('create (' + contact + ')<-[Follows]-(' + phone_number.owner + ')');
    });
  });
}

function activity_follow(follower, followed){
  Activity.create({
    user: followed,
    actor_user: follower,
    action: 'followed'
  }, function(err) {
    if(err) { logger.error(err.message) }
  });

  Activity.create({
    user: follower,
    actor_user: followed,
    action: 'following'
  }, function(err) {
    if(err) { logger.error(err.message) }
  });
}

exports.login = function (req, res, next) {
  User.find({$or: [{email: {$eq: req.body.email}}, {phone_number: {$eq: req.body.phone_number}}]}, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (user) {
      var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 24 * 30});
      res.json({token: token});
    }
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

exports.recover_password = function (req, res) {
  var phone_number = req.params.phone_number;
  User.findOne({'phone_number': phone_number}, function (err, user) {
    if (err) return handleError(err);
    var new_password = randomstring.generate({length: 6, charset: 'alphanumeric'});
    user.password = new_password;
    user.save(function (err, user) {
      if (err) return validationError(res, err);
      var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 24 * 30});
      send_sms_new_password(phone_number, new_password);
      res.json({token: token});
      //return res.send(200, "ok");
    })
  })
};

/**
 * code verification
 */
exports.verification = function (req, res) {
  var code = req.params.code;
  var userId = req.user._id;
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
    if (user.sms_code != code) {
      return res.status(404).send('code not match');
    }
    user.sms_verified = true;
    user.sms_code = '';
    user.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      //TODO: upsert phone number with owner
      mongoose.connection.db.collection('phone_numbers', function (err, numbers) {
        if (err)
          logger.error(err.message);
        else
          numbers.update({_id: user.phone_number}, {$set: {owner: user._id}}, {upsert: true});
      });
      return res.status(200).send('user verified');
    });
  });
};

/***
 * sends sms code
 */
exports.verify = function (req, res) {
  var userId = req.user._id;
  var sms_code = randomstring.generate({length: 4, charset: 'numeric'});
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    user.sms_verified = false;
    user.sms_code = sms_code;
    send_sms_verification_code(user);
    user.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).send('verification sms sent');
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
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

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
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -sms_code', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
