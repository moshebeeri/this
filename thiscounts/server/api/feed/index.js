'use strict';

var express = require('express');
var controller = require('./feed.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.hasRole('admin'),controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

/**
 * :from_id - feed reference id, the last if you scroll down and the top most if you scroll up, in case of fresh start just set to 'start'
 * :scroll -  down or up
 * :entity_type - user or group
 * :entity_id - the _id of the item of which you like to show the feed
 */
router.get('/:from_id/:scroll/:entity_type/:entity_id', auth.isAuthenticated(), controller.feed);
router.post('/new/count/group', /*auth.isAuthenticated(),*/ controller.new_count_group);

//users = db.users.find({'_id'> last_id}). limit(10);
//.hasRole('admin')
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
