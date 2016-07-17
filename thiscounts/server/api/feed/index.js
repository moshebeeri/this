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

/**
 * :feed_id - feed reference id, the last if you scroll down and the top most if you scroll up, in case of fresh start just set to 'start'
 * :scroll -  down or up
 * :entity_type - user or group
 * :entity_id - the _id of the item of which you like to show the feed
 */
router.get('/:feed_id/:scroll/:entity_type/:entity_id', auth.isAuthenticated(), controller.feed);

//users = db.users.find({'_id'> last_id}). limit(10);
//.hasRole('admin')
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
