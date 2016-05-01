/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Offer = require('./offer.model.js');

exports.register = function(socket) {
  Offer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Offer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('offer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('offer:remove', doc);
}
