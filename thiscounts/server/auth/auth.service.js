'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {

      console.log("000000000000000000000000 ----------req.headers.authorization: " + JSON.stringify(req.headers.authorization));
      var indexOfBearer = req.headers.authorization.indexOf("Bearer");
      console.log("*************** ----------indexOfBearer: " + indexOfBearer);

      // allow Cordove FileTransfer Plugin  header as well
      if(indexOfBearer != 0 && indexOfBearer != -1){

        var headerLength = req.headers.authorization.length;
        console.log("headerLength: " + headerLength);
        req.headers.authorization = req.headers.authorization.slice(indexOfBearer, headerLength-3);
        console.log("NO JSON ----------req.headers.authorization: " + req.headers.authorization);
        console.log("JSON ----------req.headers.authorization: " + JSON.stringify(req.headers.authorization));

      }
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
	    console.log("1111111111111111111111111 ----------req.headers.authorization: " + JSON.stringify(req.headers.authorization));

      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
			console.log(req.user._id);
      User.findById(req.user._id, function (err, user) {
        //if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

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
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
