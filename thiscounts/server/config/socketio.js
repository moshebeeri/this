/**
 * Socket.io configuration
 */

'use strict';

let config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/contact/contact.socket').register(socket);
  require('../api/offer/offer.socket').register(socket);
  require('../api/invite/invite.socket').register(socket);
  require('../api/review/review.socket').register(socket);
  require('../api/phone_number/phone_number.socket').register(socket);
  require('../api/image/image.socket').register(socket);
  require('../api/campaign/campaign.socket').register(socket);
  require('../api/cardType/cardType.socket').register(socket);
  require('../api/shoppingChain/shoppingChain.socket').register(socket);
  require('../api/mall/mall.socket').register(socket);
  require('../api/business/business.socket').register(socket);
  require('../api/explore/explore.socket').register(socket);
  require('../api/feed/feed.socket').register(socket);
  require('../api/profile/profile.socket').register(socket);
  require('../api/card/card.socket').register(socket);
  require('../api/notification/notification.socket').register(socket);
  require('../api/activity/activity.socket').register(socket);
  require('../api/merchant/merchant.socket').register(socket);
  require('../api/location/location.socket').register(socket);
  require('../api/category/category.socket').register(socket);
  require('../api/group/group.socket').register(socket);
  require('../api/brand/brand.socket').register(socket);
  require('../api/product/product.socket').register(socket);
  require('../api/promotion/promotion.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.handshake.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.handshake.address);
  });
};
