'use strict';

let _ = require('lodash');
let logger = require('../logger').createLogger();


/**
 * @returns {unit}
 * @constructor
 *
 * let identity = new Monad();
 * let monad = identity("Hello World");
 * monad.bind(alert);
 *
 * composition:
 * bind(bind(monad,f), g)
 *          ===
 * monad.bind(f).bind(g)
 *
 *
 *
 */
function Monad() {
  let  prototype = Object.create(null);
  function unit(value){
    let monad = Object.create(prototype);
    monad.bind = function(func, args){
      // ES6 return func(value, ...args);
      return func.apply(undefined, [value].concat(Array.prototype.slice.apply(args || [])));
    };
    return monad;
  }

  //unit.method = function(name, func){
  //  prototype[name] = func;
  //  return unit;
  //};
  unit.lift = function(name, func) {
    prototype[name] = function (agrs) {
      return func.apply(undefined, [value].concat(Array.prototype.slice.apply(args || [])));
      //ES6 return unit(this.bind(func, args));
    };
    return unit;
  };
}

//Monad.prototype.connect = function connect(){
//  logger.info("--> Connect to Utils <--");
//};


module.exports = Monad;
