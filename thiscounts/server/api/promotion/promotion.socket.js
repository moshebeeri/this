/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Promotion = require('./promotion.model');

exports.register = function(socket) {
  Promotion.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Promotion.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('promotion:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('promotion:remove', doc);
}
