'use strict';

let mongoose = require('mongoose');
let passport = require('passport');
let config = require('../config/environment');
let jwt = require('jsonwebtoken');
let expressJwt = require('express-jwt');
let compose = require('composable-middleware');
let User = require('../api/user/user.model');
let validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {

      let indexOfBearer = req.headers.authorization.indexOf("Bearer");

      // allow Cordove FileTransfer Plugin  header as well
      if(indexOfBearer !== 0 && indexOfBearer !== -1){

        let headerLength = req.headers.authorization.length;
        console.log("headerLength: " + headerLength);
        req.headers.authorization = req.headers.authorization.slice(indexOfBearer, headerLength-3);

      }
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        //if (err) return next(err);
        if (!user) {return res.status(401).send('Unauthorized');}
        if (!req.url.startsWith('/me') &&
          !req.url.startsWith('/verification/') &&
          !req.url.startsWith('/verify') &&
          user.sms_code!=='') {
          return res.status(401).send('no sms verification for url' + req.url);
        }

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: '30d' });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  let token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
