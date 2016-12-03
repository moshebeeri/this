/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Phonebook = require('./phonebook.model');

exports.register = function(socket) {
  Phonebook.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Phonebook.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('phonebook:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('phonebook:remove', doc);
}