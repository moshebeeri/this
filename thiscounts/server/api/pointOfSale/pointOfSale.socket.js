/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let PointOfSale = require('./pointOfSale.model');

exports.register = function(socket) {
  PointOfSale.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  PointOfSale.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pointOfSale:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pointOfSale:remove', doc);
}
