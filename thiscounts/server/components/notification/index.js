'use strict';
const _ = require('lodash');
const User = require('../../api/user/user.model');
const Notification = require('../../api/notification/notification.model');
const i18n = require('../i18n');
const fireEvent = require('../firebaseEvent');

const admin = require('firebase-admin');
// const serviceAccount = require("../../config/keys/this-1000-firebase-adminsdk-reo90-e33ec01e27.json");
//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://this-1000.firebaseio.com"
// });

function badge(userId, callback){
  Notification.count({})
    .where('to').equals(userId)
    .where('badge').equals(true)
    .exec(callback);
}

function flatten(array) {
  return [].concat.apply([], array);
}

function toPayloadData(notification, callback){
  let data = {};
  //https://firebase.google.com/docs/cloud-messaging/admin/send-messages
  let n = {
    //??icon: 'mipmap-hdpi/ic_launcher.png', <-- TODO: should be extended so the icon will be according to entity.
    color: '#4ad9ff',
    ttl: '3600000', // 1 hour in milliseconds
    priority: 'normal',
    // 'titleLocKey': '',
    // 'titleLocArgs': '',
    // 'sound': '',
    // 'icon': '',
    // 'bodyLocKey': '',
    // 'bodyLocArgs': '',
  };
  //console.log(JSON.stringify(notification));
  if( notification.promotion      ) data = {model: 'promotion'    , _id: notification.promotion._id     };
  if( notification.instance       ) data = {model: 'instance'     , _id: notification.instance._id      };
  if( notification.savedInstance  ) data = {model: 'savedInstance', _id: notification.savedInstance._id };
  if( notification.product        ) data = {model: 'product'      , _id: notification.product._id       };
  if( notification.group          ) data = {model: 'group'        , _id: notification.group._id         };
  if( notification.user           ) data = {model: 'user'         , _id: notification.user._id          };
  if( notification.business       ) data = {model: 'business'     , _id: notification.business._id      };
  if( notification.mall           ) data = {model: 'mall'         , _id: notification.mall._id          };
  if( notification.chain          ) data = {model: 'chain'        , _id: notification.chain._id         };
  if( notification.card           ) data = {model: 'card'         , _id: notification.card._id          };
  if( notification.cardType       ) data = {model: 'cardType'     , _id: notification.cardType._id      };
  if( notification.activity       ) data = {model: 'activity'     , _id: notification.activity._id      };
  if( notification.comment        ) data = {model: 'comment'      , _id: notification.comment._id       };

  if( notification.actor_user       ) data.actor_user     = notification.actor_user._id.toString()       ;
  if( notification.actor_business   ) data.actor_business = notification.actor_business._id.toString()   ;
  if( notification.actor_mall       ) data.actor_mall     = notification.actor_mall._id.toString()       ;
  if( notification.actor_chain      ) data.actor_chain    = notification.actor_chain._id.toString()      ;
  if( notification.actor_group      ) data.actor_group    = notification.actor_group._id.toString()      ;

  if(!data || !data._id)
    return callback(new Error(`!data || !data._id for notification ${JSON.stringify(notification)}`));

  //  consolidate by user instead of data old was: data._id = data._id.toString();
  data._id = data._id.toString();
  n.title =  data.title = notification.title;
  n.body = data.body = notification.body;
  data.note = notification.note;
  data.action = notification.action;
  data.entity = data._id.toString();
  data.notificationId = notification._id.toString();
  n.tag = notification.to._id.toString();//data._id? data._id : ''; //notification._id;
  badge(notification.to._id, function(err, badgeCount){
    if(err) return callback(err);
    //console.log(`badge of ${notification.to._id} is ${badgeCount}`);
    n.badge = badgeCount.toString();
    data.badge = badgeCount.toString();
    return callback(null, {
      data,
      notification : n
    });
  });
}

function firebasePNS(notification, registrationTokens, userId) {

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
    return console.error(new Error('!notification || !notification.options'));
  // console.log(`firebasePNS options: ${JSON.stringify(notification.options)}`);
  // console.log(`firebasePNS registrationTokens: ${JSON.stringify(registrationTokens)}`);
  toPayloadData(notification, function(err, message) {
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
    console.log(`firebase PNS ${JSON.stringify(message)}`);
    //Background
    admin.messaging().sendToDevice(registrationTokens, {data : message.data}, notification.options)
      .then(function (response) {
        //console.log(`Successfully sent message to ${userId}:${JSON.stringify(response)}`);
      })
      .catch(function (error) {
        console.log(`Error sending message to ${userId}: ${JSON.stringify(error)}`);
      });
    //Foreground & Background
    admin.messaging().sendToDevice(registrationTokens, message, notification.options)
      .then(function (response) {
        //console.log(`Successfully sent message to ${userId}:${JSON.stringify(response)}`);
      })
      .catch(function (error) {
        console.log(`Error sending message to ${userId}: ${JSON.stringify(error)}`);
      });
  })
}

function getUserFirebaseTokens(user) {
  if(user && user.firebase )
    return [_.last(user.firebase.tokens)];
  return [];
}

function pnsUserDevices(notification, translate) {
  User.findById(notification.to)
    .exec(function (err, user) {
      if (err)
        return console.error(err);

      if(!user)
        return console.error(new Error(`user id:${notification.to} not found`));
      //flatten(users.map(user => getUserFirebaseTokens(user)));
      if(translate){
        notification.title = i18n.get(notification.title, user.locale);
      }

      let registrationTokens = getUserFirebaseTokens(user);
      //console.log(`send notifications to ${notification.to._id} with tokens ${JSON.stringify(registrationTokens)}`);
      firebasePNS(notification, registrationTokens, notification.to)
    });
}

exports.pnsUserDevices = function (notification, audience) {
  pnsUserDevices(notification, audience)
};

//work around so client wong get notifications it can not display in notifications list
//should be changed in next versions.
function isPNSOnly(note){
  switch(note) {
    case 'approve_invite':
    case 'ask_invite':
    case 'card_ask_invite':
    case 'ADD_GROUP_FOLLOW_ON_ACTION':
    case 'ADD_BUSINESS_FOLLOW_ON_ACTION':
      return false;
    default:
      return true;
  }
}

exports.notify = function (note, audience, translate) {
  if(!audience || !note)
    return console.error(new Error(`notification.notify params error audience=${audience} note=${note}`));

  note.pnsOnly = isPNSOnly(note.note);

  audience.forEach(to => {
    note.to = to;
    note.timestamp = Date.now();
    note.badge = true;
    Notification.create(note, function (err, notification) {
      if (err) return console.error(err);
      Notification.findById(notification._id).exec((err, populated) => {
        if (err) return console.error(err);
        pnsUserDevices(populated, translate)
      })
    });
  });
};

exports.inAppNotify = function (note, audience) {
  if(!audience || !note)
    return console.error(new Error(`notification.notify params error audience=${audience} note=${note}`));

  note.pnsOnly = isPNSOnly(note.note);

  audience.forEach(to => {
    note.to = to;
    note.timestamp = Date.now();
    Notification.create(note, function (err, notification) {
      if (err) return console.error(err);
      fireEvent.info('user', to, 'notification_sent', {notification: notification._id});
    });
  });
};

exports.notifyUser = function (note, user, translate) {
  if(!user || !note)
    return console.error(new Error(`notification.notify params error user=${user} note=${note}`));
  note.to = user;
  note.timestamp = Date.now();
  note.badge = true;
  note.pnsOnly = isPNSOnly(note.note);

  Notification.create(note, function (err, notification) {
    if (err) return console.error(err);
    fireEvent.info('user', user, 'notification_sent', {notification: notification._id});
    Notification.findById(notification._id).exec((err, populated) => {
      if (err) return console.error(err);
      pnsUserDevices(populated, translate)
    })
  });
};
