'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
//var db = require('seraph')('http://localhost:7474')
//var model = require('seraph-model');
//var UserGraph = model(db, 'user');
var randomstring = require('randomstring');

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
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
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

  User.findById(userId, '-salt -hashedPassword', function (err, user) {
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
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
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
