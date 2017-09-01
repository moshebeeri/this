'use strict';

const _ = require('lodash');
const admin = require('firebase-admin');
const Notification = require('../../api/notification/notification.model');

const serviceAccount = require("./this-f2f45-firebase-adminsdk-npjzd-9f61718359.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://this-f2f45.firebaseio.com"
});

function Notifications() {

}

Notifications.sendToDevice = function(registrationToken, payload){
  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function(response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });

};
Notifications.pnsUserDevices = function(notification){
  //pns.push(notification)

};

// let note = {
//   note: type,
//   group: group_id,
//   actor_user: actor_user
// };
Notifications.notify = function(note, audience){
  audience.forEach(to => {
    note.to = to;
    Notification.create(note, function (err, notification) {
      if(err) return console.err(err);
      this.pnsUserDevices(notification)
    });
  });
};

module.export = Notifications;
