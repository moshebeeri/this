/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let QRCode = require('./qrcode.model');

exports.register = function(socket) {
  QRCode.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  QRCode.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('qrcode:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('qrcode:remove', doc);
}
