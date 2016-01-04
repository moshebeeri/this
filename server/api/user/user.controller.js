'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
var util = require('util');
var randomstring = require('randomstring');
var logger = require('../../components/logger').createLogger();

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('user');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword -sms_code', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};


/**
 * '/like/:id/:uid'
 *
 * MATCH (a:Person),(b:Person)
 * WHERE a.name = 'Node A' AND b.name = 'Node B'
 * CREATE (a)-[r:RELTYPE]->(b)
 * RETURN r
 *
 * MATCH (u { _id:'567747ea034cfc2d372b14e5' }), (b { _id:'567ea4b5adef97f106cd6f78' }) create (u)-[:LIKE]->(b)
 */
exports.like = function(req, res) {
  graphModel.relate(req.params.uid, 'LIKE', req.params.id);
  return res.json(200, "like called for object " + req.params.id + " and user " + req.params.uid);
};

/***
 *  '/unfollow/:id/:uid'
 *
 */
exports.unlike = function(req, res) {
  graphModel.unrelate(req.params.uid, 'LIKE', req.params.id);
  return res.json(200, "unlike called for promotion " + req.params.id + " and user " + req.params.uid);
};

function send_sms_verification_code(user) {
//send sms verification
  twilio.messages.create({
    body: "Thank you for using ThisCounts your sms code is " + user.sms_code,
    to: user.phone_number,
    from: config.twilio.number
  }, function (err, message) {
      if(err)
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
  newUser.sms_code = randomstring.generate({length:4,charset:'numeric'});
  newUser.sms_verified = false;
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*24*30 });
    res.json({ token: token });

    send_sms_verification_code(user);

    graphModel.reflect( user,
      {
        _id: user._id,
        phone: user.phone_number
      },function (err) {
      if(err) return res.send(500, err);
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
 * class	ContactsContract.CommonDataKinds.Nickname
 * class	ContactsContract.CommonDataKinds.Phone
 */
exports.phonebook = function (req, res){
  var mongoose = require('mongoose');
  var phonebook = req.body.phonebook;
  var userId = req.user._id;
  console.log(userId);
  mongoose.connection.db.collection('phonebook', function (err, collection) {
    if(err) return logger.error(err.message);
    collection.save({
      _id : userId,
      phonebook : phonebook
    });
    mongoose.connection.db.collection('phone_numbers', function (err, numbers){
      if(err) return logger.error(err.message);
      phonebook.forEach(function(element, index, array) {
        console.log(JSON.stringify(element));
        //for each phone number store the users that has it in their phone book
        //numbers.update({_id: element.normalized_number}, {$addToSet: {userIds: userId}}, {upsert: true});


        numbers.findAndModify(
          {_id: element.normalized_number},
          [['_id','asc']]                 ,
          {$addToSet: {contacts: userId}}  ,
          {upsert: true, new: true }      ,
          function(err, object) {
            if (err){
              console.warn(err.message);
            }else{
              console.dir(object);
              connect_followers(object.value)
            }
          });


        //if we have a user with this number, link users with <-[FOLLOWS]
        //user  <id>:32 phone:+972543133943
      });
    });
  });
  return res.send(200, "ok");
};


function connect_followers(phone_number){
  if(phone_number.owner == null || phone_number.contacts.length == 0)
    return;
  phone_number.contacts.forEach(function(contact){
    logger.info('create (' + contact +')<-[Follow]-('+phone_number.owner+')');
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

/**
 * sms verification
 */
exports.verification = function (req, res) {
  var code = req.params.code;
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    if(user.sms_code != code){return res.status(404).send('code not match');}
    user.sms_verified = true;
    user.save(function (err) {
      if (err) { return handleError(res, err); }
      //TODO: upsert phone number with owner
      mongoose.connection.db.collection('phone_numbers', function (err, numbers) {
        if(err)
          logger.error(err.message);
        else
          numbers.update({_id: user.phone_number}, {$set: {owner: user._id}}, {upsert: true});
      });
      return res.status(200).send('user verified');
    });
  });
};

exports.verify = function (req, res) {
  var userId = req.params.id;
  var sms_code = randomstring.generate({length:4,charset:'numeric'});
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    user.sms_verified = false;
    user.sms_code = sms_code;
    send_sms_verification_code(user);
    user.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).send('verification sms sent');
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
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
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -sms_code', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
