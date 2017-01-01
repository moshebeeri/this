'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var User = require('./user.model');
var Business = require('../business/business.model');
var ShoppingChain = require('../shoppingChain/shoppingChain.model');
var Product = require('../product/product.model');
var Promotion = require('../promotion/promotion.model');
var Mall = require('../mall/mall.model');
var Category = require('../category/category.model');
var CardType = require('../cardType/cardType.model');

var PhoneNumber = require('../phone_number/phone_number.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
var twilioLookupsClient = require('twilio').LookupsClient;
var twilioClient = new twilioLookupsClient(config.twilio.accountSid, config.twilio.authToken);
var util = require('util');

var utils = require('../../components/utils').createUtils();
var randomstring = require('randomstring');

var logger = require('../../components/logger').createLogger();
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('user');

var activity = require('../../components/activity').createActivity();
var Activity = require('../activity/activity.model');

var validationError = function (res, err) {
  var firstKey = getKey(err.errors);
  console.log("------------------------------------firstKey " + firstKey);
  if(firstKey != undefined){
	return res.status(422).json(err['errors'][firstKey]['message']);
  }
  return res.status(422).json(err);
};

function getKey(data) {
  for (var prop in data)
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

var like_generates_follow = function (userId, itemId) {
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
      if (results['user']         ||
        results['business']       ||
        results['shoppingChain']  ||
        results['product']        ||
        results['promotion']      ||
        results['mall']           ||
        results['category']       ||
        results['cardType']       ) {
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
  var userId = req.user._id;
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
  var userId = req.user._id;
  graphModel.unrelate_ids(userId, 'LIKE', req.params.id);
  return res.json(200, "unlike called for promotion " + req.params.id + " and user " + userId);
};

exports.share = function (req, res) {
  var userId = req.user._id;
  logger.info("share called for object " + req.params.id + " and user " + userId);
  graphModel.relate_ids(userId, 'SHARE', req.params.id, {timestamp: Date.now()});
  activity.action_activity(userId, req.params.id, 'share');
  return res.json(200, "share called for object " + req.params.id);
};

exports.save = function (req, res) {
  var userId = req.user._id;
  graphModel.relate_ids(userId, 'SAVE', req.params.id);
  //activity.action_activity(userId, req.params.id, 'saved');
  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

exports.follow = function (req, res) {
  var userId = req.user._id;
  graphModel.relate_ids(userId, 'FOLLOW', req.params.id);
  activity_follow(userId, req.params.id);

  return res.json(200, "like called for object " + req.params.id + " and user " + userId);
};

/***
 *  '/unlike/:id'
 *
 */
exports.unfollow = function (req, res) {
  var userId = req.user._id;
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
  var newUser = new User(req.body);
  console.log('USER CREATE-------------------------------------------------------');
  //console.log(req.body);
  //console.log("req.headers: " + JSON.stringify(req.headers));
  //console.log("req.header: " + req.header);
  console.log("req.headers.authorization: " + JSON.stringify(req.headers.authorization));
  console.log('USER CREATE--------------------------------------------------------');

  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.sms_code = randomstring.generate({length: 4, charset: 'numeric'});

  newUser.sms_verified = false;
  newUser.phone_number = utils.clean_phone_number(newUser.phone_number);
  //newUser.email = newUser.phone_number + "@groupys.com";

  User.findOne({phone_number: newUser.phone_number}, function (err, user) {
    if (user) {
			console.log("x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-");
			var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
			console.log("user: " + user);
			console.log("token: " + token);
			console.log("x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-");
			res.status(200).json({token: token});
    } else {
			newUser.save(function (err, user) {
				if (err) return validationError(res, err);
				var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
				console.log("user._id---------------------" + user._id);
				console.log("token---------------------" + token);
				console.log("config.secrets.session---------------------" + config.secrets.session);
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
	for(var i =0; i<12;i++){
		var newUser = new User(req.body);

		newUser.provider = 'local';
		newUser.role = 'user';
		newUser.sms_verified = true;
		//var randomPhone = randomstring.generate({length: 6, charset: 'numeric'});
		//newUser.phone_number = "972111" + i + i + i + i + i + i ;
    if(i === 11) {
      newUser.phone_number = "972543133943";
    } else if(i === 10) {
      newUser.phone_number = "972523325411";
    } else {
      newUser.phone_number = "0" + i + i + i + i + i + i ;
    }
		newUser.pictures = {
			 "0": {
				 "pictures": {
					 "0": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-orig.jpeg",
					 "1": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-medium.jpeg",
					 "2": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-small.jpeg",
					 "3": "https:\/\/s3.amazonaws.com\/thiscounts\/images\/bx\/mX\/rv-thumb.jpeg"
				},
				 "meta": [

				],
				 "id": "8786f6ea"
			}
		}

		console.log("****************************************");
		console.log(newUser);
		console.log("****************************************");

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
  //req.user = [];
  //req.user._id = 18;
  //var mongoose = require('mongoose');
  var phonebook = req.body;
  var userId = req.user._id;
  ////console.log(req.body);
  ////console.log(req.user._id);

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
        ////console.log(JSON.stringify(contact));

        ////identifyPhoneByTwilio(contact.normalized_number,'972');



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
  checkPhones(phonebook.phonebook, res);

};


function owner_follow(phone_number) {
  if (!utils.defined(phone_number._id) || phone_number.contacts.length == 0)
    return;
  phone_number.contacts.forEach(function (contact) {
    graphModel.follow_phone(phone_number._id, contact.nick, contact.userId);
    //logger.info('create (' + contact + ')<-[Follows]-(' + phone_number.owner + ')');
    ////logger.info('create (' + contact + ')<-[Follows]-(' + phone_number._id + ')');
  });
}

function identifyPhoneByTwilio(phone, countryCode){

  var verifiedPhone = [];
  var cleanedPhone = utils.clean_phone_number(phone);

  if(cleanedPhone != undefined){
    console.log("--------------identifyPhoneByTwilio------------------");
    twilioClient.phoneNumbers(cleanedPhone).get({
      //type: 'carrier'
    }, function(error, number) {
      if (error){
        logger.error(error.message);
        identifyPhoneByTwilioFallBack(countryCode + cleanedPhone);
      }
      else {
        /*console.log('twilio--twilio--twilio--twilio--twilio--twilio--twilio--twilio--');
        //console.log(JSON.stringify(number));
        //console.log(number.carrier.type);
        //console.log(number.carrier.name);
        console.log("country_code: " + number.country_code);
        console.log("phone_number: " + number.phone_number);
        console.log("national_format: " + number.national_format);
        console.log('twilio--twilio--twilio--twilio--twilio--twilio--twilio--twilio--');*/
      }
    });
  } else {
    console.log("--------------UNDEFINED identifyPhoneByTwilio------------------");
  }
}
function identifyPhoneByTwilioFallBack(phone){
  if(phone != undefined){
    console.log("--------------identifyPhoneByTwilio------------------");
    twilioClient.phoneNumbers(phone).get({
      //type: 'carrier'
    }, function(error, number) {
      if (error)
        logger.error(error.message);
      else {
        /*console.log('FallBack--FallBack--FallBack--FallBack--FallBack--FallBack--');
        //console.log(number.carrier.type);
        //console.log(number.carrier.name);
        console.log("country_code: " + number.country_code);
        console.log("phone_number: " + number.phone_number);
        console.log("national_format: " + number.national_format);
        console.log('FallBack--FallBack--FallBack--FallBack--FallBack--FallBack--');*/
      }
    });
  } else {
    console.log("--------------UNDEFINED identifyPhoneByTwilio------------------");
  }
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
      activity_follow(user._id, contact.userId);
      logger.info('create (' + contact + ')<-[Follows]-(' + phone_number.owner + ')');
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
      var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
      res.status(200).json({token: token});
    }
  });
};

/**
 * Get a single user by id
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

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
  var userPhoneNumber = req.params.phone_number;
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
  var list = req.body.phonebook;
  var users = [];

  getPhoneNumbers(list, users, function(message, users, list) {
    // this anonymous function will run when the
    // callback is called
    console.log("callback called! " + users);
    res.status(200).json(users);
  });
};

/**
 * Get multi users by phone numbers array
 */
function checkPhones (phoneBook, res){
  console.log("inside checkPhones");
  var list = phoneBook;
  var users = [];

  getPhoneNumbers(list, users, function(message, users, list) {
    // this anonymous function will run when the
    // callback is called
    console.log("callback called! " + users);
    users = normalizePhoneBookList(users);
    res.status(200).json(users);
  });
};


function normalizePhoneBookList(data){
  console.log("--------------------normalizePhoneBookList-----------------------");
  var tempData = {};
  for ( var contact in data ) {
    console.log(data[contact]);
    tempData[data[contact]["phone_number"]] = true;
  }
  console.log(tempData);
  console.log("--------------------normalizePhoneBookList-----------------------");
  return tempData;
}

function getPhoneNumbers(list, users, callback){
  var userPhones = [];
  //var users = [];         // shortcut to find them faster afterwards

  for (var l in list) {       // first build the search array
    var o = list[l];
    console.log(o.number);
    if (o.number) {
      //userPhones.push( new mongoose.Types.ObjectId( o.number ) );           // for the Mongo query
      userPhones.push(o.number);           // for the Mongo query
      //users[o.number] = o;                                // to find the user quickly afterwards
    }
  }

  //console.log(JSON.stringify(list));
  //console.log(JSON.stringify(users));
  console.log(JSON.stringify(userPhones));

  mongoose.connection.db.collection("users").find( {phone_number: {$in: userPhones}} ).each(function(err, user) {
    //if (err) return handleError(err);
    if (err) callback( err, users);
    else {
      //console.log(JSON.stringify(user));
      if (user && user._id) {
        console.log(JSON.stringify(user));
        users.push(user);
        console.log("--------------------------------");
        console.log(JSON.stringify(users));
        console.log("--------------------------------");
      } else {                        // end of list
        console.log("end--end--end--end--end--end--end--");
        //res.status(200).json(users);
        callback( null, users );
      }
    }
  });

  //if (!users) return res.status(401).send('Unauthorized');
};

exports.recover_password = function (req, res) {
  var phone_number = req.params.phone_number;
  User.findOne({'phone_number': phone_number}, function (err, user) {
    if (err) return handleError(err);
    var new_password = randomstring.generate({length: 6, charset: 'alphanumeric'});
    user.password = new_password;
    user.save(function (err, user) {
      if (err) return validationError(res, err);
      var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 24 * 30});
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
 * Change a users info
 */
exports.updateInfo = function (req, res, next) {
  var userId = req.user._id;
  console.log("===========req.user._id: "+ req.user._id);
  console.log("===========req.body['phone_number']: "+ req.body['phone_number']);
  var newUser = req.body;
  printObject(req.body);


  var query = {'phone_number':req.body['phone_number']};

  User.findOneAndUpdate(query, newUser, {upsert:true}, function(err, doc){
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
  var userId = req.user._id;
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

function printObject(object){
  var output = '';
  for (var property in object) {
    output += property + ': ' + object[property]+'; ';
  }
  console.log(output);

}
