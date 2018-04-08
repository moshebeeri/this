'use strict';

const admin = require("firebase-admin");
const serviceAccount = require("../../config/keys/this-1000-firebase-adminsdk-reo90-e33ec01e27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://this-1000.firebaseio.com"
});
// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const ref = db.ref('events');

function FirebaseEvent() {
}

FirebaseEvent.change = function(type, _id) {
  // create a child node of the above path and write the following data to it
  const usersRef = ref.child(`${type}_${_id}`);
  usersRef.set({
    change: {
      time: Date.now().toString()
    }
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

module.exports = FirebaseEvent;


