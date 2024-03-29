'use strict';

let _ = require('lodash');
let Phonebook = require('./phonebook.model');
let mongoose = require('mongoose');

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
  let UserId = req.user._id;
  //let UserId = req.params.id;
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

  let phonebook = req.body;
  let userId = req.user._id;

  Phonebook.findOne({userId: userId}, function (err, user) {
    if (user) {
      let query = {'userId':userId};
      Phonebook.findOneAndUpdate(query, phonebook.phonebook, {upsert:true}, function(err, doc){
        if (err) return res.status(500).send(err);
        checkPhones(phonebook.phonebook, res);
      });
    } else {
      Phonebook.create({userId: userId, phonebook: phonebook.phonebook}, function(err, phonebook) {
        if(err) { return handleError(res, err); }
        res.status(200).send();
        //checkPhones(phonebook.phonebook, res);
      });
    }
  });
};

/**
 * Get multi users by phone numbers array
 */
function checkPhones (phoneBook, res){
  let list = phoneBook;
  let users = [];

  getPhoneNumbers(list, users, function(message, users, list) {
    // this anonymous function will run when the
    // callback is called
    users = normalizePhoneBookList(users, list);
    res.status(200).json(users);
  });
}


function normalizePhoneBookList(users, phonebook){
  let tempData = {};
  let tempData2 = [];
  let counterUser = 0;
  for ( let user in users ) {
    tempData[users[user].phone_number] = true;
    tempData2[counterUser] = users[user.phone_number];
    counterUser++;
  }
  for ( let contact in phonebook ) {
    if(tempData2.indexOf(phonebook[contact].number)>-1){
      phonebook[contact].pictures = users[tempData2.indexOf(phonebook[contact.number])].pictures;
      phonebook[contact]._id = users[tempData2.indexOf(phonebook[contact.number])]._id;
      phonebook[contact].sms_verified = users[tempData2.indexOf(phonebook[contact.number])].sms_verified;
      phonebook[contact].isMember = true;
    } else {
      phonebook[contact].isMember = false;
    }
  }
  return phonebook;
}

function getPhoneNumbers(list, users, callback){
  let userPhones = [];
  //let users = [];         // shortcut to find them faster afterwards

  for (let l in list) {       // first build the search array
    let o = list[l];
    if (o.number) {
      //userPhones.push( new mongoose.Types.ObjectId( o.number ) );           // for the Mongo query
      userPhones.push(o.number);           // for the Mongo query
      //users[o.number] = o;                                // to find the user quickly afterwards
    }
  }

  mongoose.connection.db.collection("users").find( {phone_number: {$in: userPhones}} ).each(function(err, user) {
    //if (err) return handleError(err);
    if (err) callback( err, users, list);
    else {
      //console.log(JSON.stringify(user));
      if (user && user._id) {
        users.push(user);
      } else {                        // end of list
        //res.status(200).json(users);
        callback( null, users, list );
      }
    }
  });

  //if (!users) return res.status(401).send('Unauthorized');
}

// Updates an existing phonebook in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Phonebook.findById(req.params.id, function (err, phonebook) {
    if (err) { return handleError(res, err); }
    if(!phonebook) { return res.send(404); }
    let updated = _.merge(phonebook, req.body);
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
