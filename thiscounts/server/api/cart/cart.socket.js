/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Cart = require('./cart.model.js');

exports.register = function(socket) {
  Cart.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Cart.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('cart:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('cart:remove', doc);
}
