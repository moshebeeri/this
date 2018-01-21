'use strict';
const _ = require('lodash');
const admin = require('firebase-admin');
const User = require('../../api/user/user.model');
const Notification = require('../../api/notification/notification.model');
const serviceAccount = require("../../config/keys/this-1000-firebase-adminsdk-reo90-e33ec01e27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://this-1000.firebaseio.com"
});

function unread(userId, callback){
  Notification.count({})
    .where('to').equals(userId)
    .where('read').equals(false)
    .exec(callback);
}

function flatten(array) {
  return [].concat.apply([], array);
}

function toPayloadData(notification, callback){
  let data = {};
  let n = {
    color: '#4ad9ff',
    badge: '0',
    // 'titleLocKey': '',
    // 'titleLocArgs': '',
    // 'sound': '',
    // 'icon': '',
    // 'bodyLocKey': '',
    // 'bodyLocArgs': '',
  };
  //console.log(JSON.stringify(notification));
  if( notification.promotion ) data = {model: 'promotion'  , _id: notification.promotion._id };
  if( notification.instance  ) data = {model: 'instance'   , _id: notification.instance._id  };
  if( notification.product   ) data = {model: 'product'    , _id: notification.product._id   };
  if( notification.group     ) data = {model: 'group'      , _id: notification.group._id     };
  if( notification.user      ) data = {model: 'user'       , _id: notification.user._id      };
  if( notification.business  ) data = {model: 'business'   , _id: notification.business._id  };
  if( notification.mall      ) data = {model: 'mall'       , _id: notification.mall._id      };
  if( notification.chain     ) data = {model: 'chain'      , _id: notification.chain._id     };
  if( notification.card      ) data = {model: 'card'       , _id: notification.card._id      };
  if( notification.activity  ) data = {model: 'activity'   , _id: notification.activity._id  };
  if( notification.comment   ) data = {model: 'comment'    , _id: notification.comment._id   };
  data._id = data._id.toString();
  n.title =  data.title = notification.title;
  n.body = data.body = notification.body;
  data.note = notification.note;
  data.action = notification.action;
  data.notificationId = notification._id;
  n.tag = data._id? data._id : '';
  unread(notification.to, function(err, badge){
    if(err) return callback(err);
    n.badge = badge;
    data.badge = badge;
    console.log(JSON.stringify(data));
    return callback(null, {
      data,
      notification : n
    });
  });
}

function firebasePNS(notification, registrationTokens) {

// See the "Defining the message payload" section below for details
// on how to define a message payload.
//   var payload = {
//     notification: {
//       title: "$GOOG up 1.43% on the day",
//       body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
//     },
//     data: {
//       stock: "GOOG",
//       open: 829.62,
//       close: "635.67"
//     }
//   };
//   var options = {
//     priority: "high",
//     timeToLive: 60 * 60 * 24
//   };
// Send a message to the devices corresponding to the provided
// registration tokens.
  if (!notification || !notification.options)
    return;
  // console.log(`firebasePNS options: ${JSON.stringify(notification.options)}`);
  // console.log(`firebasePNS registrationTokens: ${JSON.stringify(registrationTokens)}`);
  toPayloadData(notification, function(err, payload) {
    if(err) return console.error(err);
    /*
        let payload = {
          data: {
            model: 'instance',
            _id: '5a3668ea13c88202318fedcb',
            notificationId: '5a3668ea13c88202318fedcb',
            title: 'My Title',
            body: 'My Body',
            action: 'OK'
          },
          notification: {
            title: 'My Title',
            body: 'My Body',
            clickAction: 'CLAIM',
            tag: 'test', //should be data._id by default
            color: '#4ad9ff',
            badge: '0'
            // 'titleLocKey': '',
            // 'titleLocArgs': '',
            // 'sound': '',
            // 'icon': '',
            // 'bodyLocKey': '',
            // 'bodyLocArgs': '',
          }
        };
      */
    //admin.messaging().sendToDevice(registrationTokens, notification.payload, notification.options)
    admin.messaging().sendToDevice(registrationTokens, payload, notification.options)
      .then(function (response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  })
}

function getUserFirebaseTokens(user) {
  return [_.last(user.firebase.tokens)]
}

function pnsUserDevices(notification) {
  User.findById(notification.to)
    .exec(function (err, user) {
      if (err) {
        return console.error(err);
      }
      //flatten(users.map(user => getUserFirebaseTokens(user)));
      let registrationTokens = getUserFirebaseTokens(user);
      firebasePNS(notification, registrationTokens)
    });
}

exports.pnsUserDevices = function (notification, audience) {
  pnsUserDevices(notification, audience)
};

exports.notify = function (note, audience) {
  audience.forEach(to => {
    note.to = to;
    Notification.create(note, function (err, notification) {
      if (err) return console.error(err);
      Notification.findById(notification._id).exec((err, populated) => {
        if (err) return console.error(err);
        pnsUserDevices(populated)
      })
    });
  });
};
