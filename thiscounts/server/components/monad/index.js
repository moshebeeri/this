'use strict';
let Utils = require('./monad');

exports.createMonad = function createMonad() {
  return new Utils();
};
