'use strict';
const _ = require('lodash');
const admin = require('firebase-admin');
const User = require('../../api/user/user.model');
const Notification = require('../../api/notification/notification.model');
const serviceAccount = require("../../config/keys/this-1000-firebase-adminsdk-reo90-e33ec01e27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://this-f2f45.firebaseio.com"
});

function flatten(array) {
  return [].concat.apply([], array);
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
  console.log(`firebasePNS ${JSON.stringify(notification)}`);

  if(!notification || !notification.payload || !notification.options)
    return;

  console.log(`call sendToDevice ${registrationTokens}`);

  admin.messaging().sendToDevice(registrationTokens, notification.payload, notification.options)
    .then(function (response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
}

function getUserFirebaseTokens(user) {
  console.log(`user.firebase.tokens: ${user.firebase.tokens}`);
  return [_.last(user.firebase.tokens)]
}

function pnsUserDevices(notification, audience) {
  console.log(`pnsUserDevices
                  notification: ${JSON.stringify(notification)}
                  audience: ${JSON.stringify(audience)}
               `);

  User.find({})
    .where('_id').in(audience)
    .exec(function (err, users) {
      if (err) {
        return console.error(err);
      }

      let registrationTokens = flatten(users.map(user => getUserFirebaseTokens(user)));
      console.log(`registrationTokens: ${JSON.stringify(registrationTokens)}`);
      firebasePNS(notification, registrationTokens)
    });
}

exports.pnsUserDevices = function (notification, audience) {
  pnsUserDevices(notification, audience)
};
// let note = {
//   note: type,
//   group: group_id,
//   actor_user: actor_user
// };
exports.notify = function (note, audience) {
  console.log('exports.notify');
  audience.forEach(to => {
    note.to = to;
    Notification.create(note, function (err, notification) {
      if (err) return console.error(err);
      pnsUserDevices(notification, audience)
    });
  });
};
