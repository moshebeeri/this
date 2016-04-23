'use strict';
var Utils = require('./monad');

exports.createMonad = function createMonad() {
  return new Utils();
};
