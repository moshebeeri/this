'use strict';

var _ = require('lodash');
var Phonebook = require('./phonebook.model');
var mongoose = require('mongoose');
var config = require('../../config/environment');
var twilioLookupsClient = require('twilio').LookupsClient;
var twilioClient = new twilioLookupsClient(config.twilio.accountSid, config.twilio.authToken);

// Get list of phonebooks
exports.index = function(req, res) {
  Phonebook.find(function (err, phonebooks) {
    if(err) { return handleError(res, err); }
    return res.json(200, phonebooks);
  });
};

// Get a single phonebook
exports.show = function(req, res) {
  Phonebook.findById(req.params.id, function (err, phonebook) {
    if(err) { return handleError(res, err); }
    if(!phonebook) { return res.send(404); }
    return res.json(phonebook);
  });
};


/**
 * Get a single user by phone number
 */
exports.showByUserId = function (req, res, next) {
  var UserId = req.user._id;
  //var UserId = req.params.id;
  Phonebook.findOne({userId: UserId}, function (err, phonebook) {
    if (err) return next(err);
    if (!phonebook) return res.status(401).send('Unauthorized');
    res.status(200).json(phonebook);
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
exports.create = function (req, res) {

  var phonebook = req.body;
  var userId = req.user._id;
  console.log(req.body);
  console.log(req.user._id);


  Phonebook.findOne({userId: userId}, function (err, user) {
    if (user) {
      /*Phonebook.update({userId: userId, phonebook: phonebook.phonebook}, function(err, phonebook) {
        if(err) { console.log("ERRRRRRRRRRRRRROR"); return handleError(res, err); }
        checkPhones(phonebook.phonebook, res);
      });*/
      var query = {'userId':userId};
      Phonebook.findOneAndUpdate(query, phonebook.phonebook, {upsert:true}, function(err, doc){
        if (err) return res.status(500).send(err);
        checkPhones(phonebook.phonebook, res);
      });

    } else {
      Phonebook.create({userId: userId, phonebook: phonebook.phonebook}, function(err, phonebook) {
        if(err) { return handleError(res, err); }
        checkPhones(phonebook.phonebook, res);
      });
    }
  });




  /*
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
  */

};

/**
 * Get multi users by phone numbers array
 */
function checkPhones (phoneBook, res){
  var list = phoneBook;
  var users = [];

  getPhoneNumbers(list, users, function(message, users, list) {
    // this anonymous function will run when the
    // callback is called
    console.log("callback called! " + users);
    users = normalizePhoneBookList(users, list);
    res.status(200).json(users);
  });
};


function normalizePhoneBookList(users, phonebook){
  console.log("--------------------normalizePhoneBookList-----------------------");
  var tempData = {};
  var tempData2 = [];
  var counterUser = 0;
  for ( var user in users ) {
    console.log(users[user]["phone_number"]);
    tempData[users[user]["phone_number"]] = true;
    tempData2[counterUser] = users[user]["phone_number"];
    counterUser++;
  }
  console.log("-------------------------------------------");
  console.log(tempData2);
  console.log("--------------------phonebook-----------------------");
  console.log(JSON.stringify(users));
  for ( var contact in phonebook ) {
    if(tempData2.indexOf(phonebook[contact]["number"])>-1){
      phonebook[contact]["pictures"] = users[tempData2.indexOf(phonebook[contact]["number"])]["pictures"];
      phonebook[contact]["_id"] = users[tempData2.indexOf(phonebook[contact]["number"])]["_id"];
      phonebook[contact]["sms_verified"] = users[tempData2.indexOf(phonebook[contact]["number"])]["sms_verified"];
      phonebook[contact]["isMember"] = true;
      console.log("---" + JSON.stringify(phonebook[contact]));
    } else {
      phonebook[contact]["isMember"] = false;
    }
    //console.log(contact + " : " + phonebook[contact]["number"].length);
  }
  console.log("--------------------phonebook-----------------------");
  console.log("--------------------normalizePhoneBookList-----------------------");
  return phonebook;
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
    if (err) callback( err, users, list);
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
        callback( null, users, list );
      }
    }
  });

  //if (!users) return res.status(401).send('Unauthorized');
};

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

// Updates an existing phonebook in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Phonebook.findById(req.params.id, function (err, phonebook) {
    if (err) { return handleError(res, err); }
    if(!phonebook) { return res.send(404); }
    var updated = _.merge(phonebook, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, phonebook);
    });
  });
};

// Deletes a phonebook from the DB.
exports.destroy = function(req, res) {
  Phonebook.findById(req.params.id, function (err, phonebook) {
    if(err) { return handleError(res, err); }
    if(!phonebook) { return res.send(404); }
    phonebook.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
