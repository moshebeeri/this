'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let async = require('async');
let User = require('./user.model');
let Business = require('../business/business.model');
let ShoppingChain = require('../shoppingChain/shoppingChain.model');
let Product = require('../product/product.model');
let Promotion = require('../promotion/promotion.model');
let Mall = require('../mall/mall.model');
let Category = require('../category/category.model');
let CardType = require('../cardType/cardType.model');

let PhoneNumber = require('../phone_number/phone_number.model');
let passport = require('passport');
let config = require('../../config/environment');
let jwt = require('jsonwebtoken');
let twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
let twilioLookupsClient = require('twilio').LookupsClient;
let twilioClient = new twilioLookupsClient(config.twilio.accountSid, config.twilio.authToken);
let util = require('util');

let utils = require('../../components/utils').createUtils();
let randomstring = require('randomstring');

let logger = require('../../components/logger').createLogger();
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('user');

let activity = require('../../components/activity').createActivity();
let Activity = require('../activity/activity.model');

let validationError = function (res, err) {
  let firstKey = getKey(err.errors);
  if (firstKey !== undefined) {
    return res.status(422).json(err['errors'][firstKey]['message']);
  }
  return res.status(422).json(err);
};

function getKey(data) {
  for (let prop in data)
    if (data.propertyIsEnumerable(prop))
      return prop;
}

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

let like_generates_follow = function (userId, itemId) {
  async.parallel({
      user: function (callback) {
        User.findById(itemId, callback);
      },
      business: function (callback) {
        Business.findById(itemId, callback);
      },
      shoppingChain: function (callback) {
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
      },
      category: function (callback) {
        Category.findById(itemId, callback);
      },
      cardType: function (callback) {
        CardType.findById(itemId, callback);
      }
    },
    function (err, results) {
      // results is now equals to: {one: 1, two: 2}
      if (results['user'] ||
        results['business'] ||
        results['shoppingChain'] ||
        results['product'] ||
        results['promotion'] ||
        results['mall'] ||
        results['category'] ||
        results['cardType']) {
        graphModel.relate_ids(userId, 'FOLLOW', itemId);
        activity_follow(userId, itemId);
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
  graphModel.relate_ids(userId, 'LIKE', req.params.id);
  activity.action_activity(userId, req.params.id, 'like');
  like_generates_follow(userId, req.params.id);
  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unlike = function (req, res) {
  let userId = req.user._id;
  graphModel.unrelate_ids(userId, 'LIKE', req.params.id);
  return res.json(200, "unlike called for promotion " + req.params.id + " and user " + userId);
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
  graphModel.relate_ids(userId, 'FOLLOW', req.params.id);
  activity_follow(userId, req.params.id);

  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unfollow = function (req, res) {
  let userId = req.user._id;
  graphModel.unrelate_ids(userId, 'FOLLOW', req.params.id);
  return res.json(200, "unlike called for promotion " + req.params.id + " and user " + userId);
};


function send_sms_verification_code(user) {
  send_sms_message(user.phone_number,
    "GROUPYS code " + user.sms_code
  );
}


function send_sms_new_password(phone_number, new_password) {
  send_sms_message(phone_number,
    "GROUPYS new password " + new_password
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

  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.sms_code = randomstring.generate({length: 4, charset: 'numeric'});

  newUser.sms_verified = false;
  newUser.phone_number = utils.clean_phone_number(newUser.phone_number);

  User.findOne({phone_number: newUser.phone_number}, function (err, user) {
    if (user) {
      let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
      res.status(200).json({token: token});
    } else {
      newUser.save(function (err, user) {
        if (err) return validationError(res, err);
        let token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
        res.status(200).json({token: token});

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
    }
  });

};


/**
 * Creates a new demo user
 */
exports.createDemo = function (req, res, next) {
  for (let i = 0; i < 12; i++) {
    let newUser = new User(req.body);

    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.sms_verified = true;
    //let  randomPhone = randomstring.generate({length: 6, charset: 'numeric'});
    //newUser.phone_number = "972111" + i + i + i + i + i + i ;
    if (i === 11) {
      newUser.phone_number = "972543133943";
    } else if (i === 10) {
      newUser.phone_number = "972523325411";
    } else {
      newUser.phone_number = "0" + i + i + i + i + i + i;
    }
    newUser.pictures = {
      "0": {
        "pictures": {
          "0": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-orig.jpeg",
          "1": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-medium.jpeg",
          "2": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-small.jpeg",
          "3": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-thumb.jpeg"
        },
        "meta": [],
        "id": "8786f6ea"
      }
    };

    newUser.save(function (err, user) {
      if (err) return validationError(res, err);

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

  }
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

  mongoose.connection.db.collection('phonebook', function (err, collection) {
    if (err) return logger.error(err.message);
    collection.save({
      _id: userId,
      phonebook: phonebook.phonebook
    });
    //TODO: implement this way http://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
    //For each phone number store the users that has it in their phonebook
    mongoose.connection.db.collection('phone_numbers', function (err, collection) {
      if (err) return logger.error(err.message);
      phonebook.phonebook.forEach(function (contact, index, array) {
        if (utils.defined(contact.normalized_number) && utils.defined(contact.name)) {
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
                console.error(err.message);
              } else {
                let phone_number = object.value;
                if (utils.defined(phone_number._id)) {
                  graphModel.follow_user_by_phone_number(phone_number._id, contact.nick, userId);
                }
              }
            });
        }
      });
      graphModel.owner_followers_follow_business_default_group(userId);

    });
  });
  //Not needed
  //checkPhones(phonebook.phonebook, res);
  return res.status(200).send('phonebook received');
};


/*
 function identifyPhoneByTwilio(phone, countryCode){

 let  verifiedPhone = [];
 let  cleanedPhone = utils.clean_phone_number(phone);

 if(cleanedPhone !== undefined){
 twilioClient.phoneNumbers(cleanedPhone).get({
 //type: 'carrier'
 }, function(error, number) {
 if (error){
 logger.error(error.message);
 identifyPhoneByTwilioFallBack(countryCode + cleanedPhone);
 }
 else {
 /!*console.log('twilio--twilio--twilio--twilio--twilio--twilio--twilio--twilio--');
 //console.log(JSON.stringify(number));
 //console.log(number.carrier.type);
 //console.log(number.carrier.name);
 console.log("country_code: " + number.country_code);
 console.log("phone_number: " + number.phone_number);
 console.log("national_format: " + number.national_format);
 console.log('twilio--twilio--twilio--twilio--twilio--twilio--twilio--twilio--');*!/
 }
 });
 } else {
 }
 }
 function identifyPhoneByTwilioFallBack(phone){
 if(phone != undefined){
 twilioClient.phoneNumbers(phone).get({
 //type: 'carrier'
 }, function(error, number) {
 if (error)
 logger.error(error.message);
 else {
 /!*console.log('FallBack--FallBack--FallBack--FallBack--FallBack--FallBack--');
 //console.log(number.carrier.type);
 //console.log(number.carrier.name);
 console.log("country_code: " + number.country_code);
 console.log("phone_number: " + number.phone_number);
 console.log("national_format: " + number.national_format);
 console.log('FallBack--FallBack--FallBack--FallBack--FallBack--FallBack--');*!/
 }
 });
 } else {
 }
 }
 */


/**
 * if this users number exist in phone_numbers collection
 * then all users (ids in contacts) should be followed by him
 * @param user
 */
function new_user_follow(user) {
  PhoneNumber.findById(user.phone_number, function (err, phone_number) {
    if (err) {
      return logger.error(err.message);
    }
    if (!phone_number) return;
    //We have this number, make user follow the users who have his number
    phone_number.contacts.forEach(function (contact) {
      graphModel.follow_user_by_phone_number(user.phone_number, contact.nick, contact.userId);
      graphModel.follow_business_owner_by_phone_number(user.phone_number);

      activity_follow(user._id, contact.userId);
    });
  });
}

function activity_follow(follower, followed) {
  Activity.create({
    user: followed,
    actor_user: follower,
    action: 'followed'
  }, function (err) {
    if (err) {
      logger.error(err.message)
    }
  });

  Activity.create({
    user: follower,
    actor_user: followed,
    action: 'following'
  }, function (err) {
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

  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.status(200).json(user.profile);
  });
};

/**
 * Get a single user by phone number
 */
exports.showByPhone = function (req, res, next) {
  let userPhoneNumber = req.params.phone_number;
  User.findOne({phone_number: userPhoneNumber}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.status(200).json(user.profile);
  });
};
/**
 * Get multi users by phone numbers array
 */
exports.checkPhoneNumbers = function (req, res, next) {
  //console.log(req.body);
  let list = req.body.phonebook;
  let users = [];

  getPhoneNumbers(list, users, function (message, users, list) {
    // this anonymous function will run when the
    // callback is called
    console.log("callback called! " + users);
    res.status(200).json(users);
  });
};

/**
 * Get multi users by phone numbers array
 */
function checkPhones(phoneBook, res) {
  let list = phoneBook;
  let users = [];

  getPhoneNumbers(list, users, function (message, users, list) {
    users = normalizePhoneBookList(users);
    res.status(200).json(users);
  });
}


function normalizePhoneBookList(data) {
  let tempData = {};
  for (let contact in data) {
    console.log(data[contact]);
    tempData[data[contact]["phone_number"]] = true;
  }
  console.log(tempData);
  return tempData;
}

function getPhoneNumbers(list, users, callback) {
  let userPhones = [];

  for (let l in list) {
    let o = list[l];
    console.log(o.number);
    if (o.number) {
      userPhones.push(o.number);
    }
  }
  mongoose.connection.db.collection("users").find({phone_number: {$in: userPhones}}).each(function (err, user) {
    if (err) callback(err, users);
    else {
      if (user && user._id) {
        users.push(user);
      } else {
        callback(null, users);
      }
    }
  });

}

exports.recover_password = function (req, res) {
  let phone_number = req.params.phone_number;
  User.findOne({'phone_number': phone_number}, function (err, user) {
    if (err) return handleError(err);
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

/**
 * code verification
 */
exports.verification = function (req, res) {
  console.log("req.params.code: " + req.params.code);
  console.log("req.user._id: " + req.user._id);
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
    if (user.sms_code !== code) {
      console.log('Code not match userId ' + userId + ' user code ' + user.sms_code + ' received ' + code);
      return res.status(401).send('Code not match userId ' + userId + ' user code ' + user.sms_code + ' received ' + code);
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
  let userId = req.user._id;
  let newUser = req.body;
  let query = {'phone_number': req.body['phone_number']};

  User.findOneAndUpdate(query, newUser, {upsert: true}, function (err, doc) {
    if (err) return res.status(500).send(err);
    return res.status(200).send("succesfully saved");
  });
  /*
   User.findById(userId, function (err, user) {
   newUser.update(function (err, user) {
   if (err) return next(err);
   if (!user) return res.status(401).send('Unauthorized');
   res.status(200).json(user);
   });
   });
   */
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
    if (!user) return res.status(401).send('Unauthorized');
    res.status(200).json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}


function printObject(object) {
  let output = '';
  for (let property in object) {
    output += property + ': ' + object[property] + '; ';
  }
  console.log(output);
}
