/**
 * Main application routes
 */

'use strict';

let errors = require('./components/errors');
let path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/pricings', require('./api/pricing'));
  app.use('/api/realizes', require('./api/realize'));
  app.use('/api/instances', require('./api/instance'));
  app.use('/api/savedInstances', require('./api/savedInstance'));
  app.use('/api/contacts', require('./api/contact'));
  app.use('/api/offers', require('./api/offer'));
  app.use('/api/invites', require('./api/invite'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/phone_numbers', require('./api/phone_number'));
  app.use('/api/phonebooks', require('./api/phonebook'));
  app.use('/api/images', require('./api/image'));
  app.use('/api/carts', require('./api/cart'));
  app.use('/api/videos', require('./api/video'));
  app.use('/api/campaigns', require('./api/campaign'));
  app.use('/api/cardTypes', require('./api/cardType'));
  app.use('/api/shoppingChains', require('./api/shoppingChain'));
  app.use('/api/pointOfSales', require('./api/pointOfSale'));
  app.use('/api/malls', require('./api/mall'));
  app.use('/api/businesses', require('./api/business'));
  app.use('/api/explores', require('./api/explore'));
  app.use('/api/feeds', require('./api/feed'));
  app.use('/api/posts', require('./api/post'));
  app.use('/api/profiles', require('./api/profile'));
  app.use('/api/cards', require('./api/card'));
  app.use('/api/notifications', require('./api/notification'));
  app.use('/api/activities', require('./api/activity'));
  app.use('/api/merchants', require('./api/merchant'));
  app.use('/api/locations', require('./api/location'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/groups', require('./api/group'));
  app.use('/api/brands', require('./api/brand'));
  app.use('/api/comments', require('./api/comment'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/promotions', require('./api/promotion'));
  app.use('/api/qrcodes', require('./api/qrcode'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/ip', require('./components/ip'));

  app.use('/api/tests', require('./api/test'));

  app.use('/api/breeze', require('./components/breeze'));

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
