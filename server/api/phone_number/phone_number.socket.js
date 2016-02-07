/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var PhoneNumber = require('./phone_number.model');

exports.register = function(socket) {
  PhoneNumber.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  PhoneNumber.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('phone_number:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('phone_number:remove', doc);
}