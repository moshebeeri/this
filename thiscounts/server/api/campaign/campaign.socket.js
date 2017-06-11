/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Campaign = require('./campaign.model');

exports.register = function(socket) {
  Campaign.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Campaign.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('campaign:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('campaign:remove', doc);
}
