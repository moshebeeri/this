'use strict';
const config = require('../../config/environment');
const activity = require('../activity').createActivity();

function Suggest() {
}


Suggest.businesses =
Suggest.prototype.businesses = function (user) {
  // activity.activity({
  //   user: user,
  //   action: 'business_suggestion',
  //   business: businesses._id,
  //   sharable: true,
  //   audience: ['SELF']
  // }, function (err) {
  //   if (err) console.error(err.message)
  // });
};

Suggest.publicGroups =
  Suggest.prototype.publicGroups = function(payer, callback) {
};

Suggest.usersToFollow =
  Suggest.prototype.usersToFollow = function (entity, callback) {
  };

module.exports = Suggest;


