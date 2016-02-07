/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/phone_numbers', require('./api/phone_number'));
  app.use('/api/images', require('./api/image'));
  app.use('/api/campaigns', require('./api/campaign'));
  app.use('/api/cardTypes', require('./api/cardType'));
  app.use('/api/shoppingChains', require('./api/shoppingChain'));
  app.use('/api/malls', require('./api/mall'));
  app.use('/api/businesses', require('./api/business'));
  app.use('/api/explores', require('./api/explore'));
  app.use('/api/feeds', require('./api/feed'));
  app.use('/api/profiles', require('./api/profile'));
  app.use('/api/cards', require('./api/card'));
  app.use('/api/notifications', require('./api/notification'));
  app.use('/api/activities', require('./api/activity'));
  app.use('/api/merchants', require('./api/merchant'));
  app.use('/api/locations', require('./api/location'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/groups', require('./api/group'));
  app.use('/api/brands', require('./api/brand'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/promotions', require('./api/promotion'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
