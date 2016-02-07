'use strict';

var express = require('express');
var controller = require('./feed.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


router.get('/:last_id/:scroll', auth.isAuthenticated(), controller.feed);

//users = db.users.find({'_id'> last_id}). limit(10);
//.hasRole('admin')
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
