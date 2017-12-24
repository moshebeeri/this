/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Pricing = require('./pricing.model');

exports.register = function(socket) {
  Pricing.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pricing.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pricing:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pricing:remove', doc);
}
