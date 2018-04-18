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

FirebaseEvent.change = function(entityName, entity_id) {
  console.log(`FirebaseEvent.change ${JSON.stringify({entityName, entity_id})}`);
  // create a child node of the above path and write the following data to it
  const theRef = ref.child(`${entityName}_${entity_id.toString()}`);
  theRef.set({
    type: 'change',
    time: Date.now().toString()
  })
  .then()
  .catch((err) => {
    console.error(err);
  });
};

FirebaseEvent.info = function(entityName, entity_id, type, obj) {
  console.log(`FirebaseEvent.info ${JSON.stringify({entityName, entity_id, type, obj})}`);
  // create a child node of the above path and write the following data to it
  obj.type = type;
  obj.time = Date.now().toString();
  const theRef = ref.child(`${entityName}_${entity_id.toString()}`);
  theRef.set(obj)
    .then()
    .catch((err) => {
      console.error(err);
    });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

module.exports = FirebaseEvent;


