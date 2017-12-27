'use strict';
const _ = require('lodash');
const admin = require('firebase-admin');
const User = require('../../api/user/user.model');
const Notification = require('../../api/notification/notification.model');
const serviceAccount = require("../../config/keys/this-1000-firebase-adminsdk-bfa37-bc1fe08209.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://this-f2f45.firebaseio.com"
});

function flatten(array) {
// mapReduce = (a -> b, (b,a) -> b, (b,a) -> b)
  const mapReduce = (m, r) =>
    (acc, x) => r(acc, m(x));
// concat :: ([a],[a]) -> [a]
  const concat = (xs, ys) =>
    xs.concat(ys);
// concatMap :: (a -> [b]) -> [a] -> [b]
  const concatMap = f => xs =>
    xs.reduce(mapReduce(f, concat), []);
// id :: a -> a
  const id = x =>
    x;
// flatten :: [[a]] -> [a]
  const flatten =
    concatMap(id);
// deepFlatten :: [[a]] -> [a]
  const deepFlatten =
    concatMap(x =>
      Array.isArray(x) ? deepFlatten(x) : x);
  deepFlatten(array)
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

  if(!notification || !notification.payload || !notification.options)
    return;

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
  return [_.last(user.firebase.tokens)]
}

function pnsUserDevices(notification, audience) {
  User.find({})
    .where('_id').in(audience)
    .exec(function (err, users) {
      if (err) {
        return console.error(err);
      }
      let registrationTokens = flatten(users.map(user => getUserFirebaseTokens(user)));
      firebasePNS(registrationTokens, notification)
    });
}

exports.pnsUserDevices = function (notification) {
  pnsUserDevices(notification)
};
// let note = {
//   note: type,
//   group: group_id,
//   actor_user: actor_user
// };
exports.notify = function (note, audience) {
  audience.forEach(to => {
    note.to = to;
    Notification.create(note, function (err, notification) {
      if (err) return console.error(err);
      pnsUserDevices(notification, audience)
    });
  });
};
