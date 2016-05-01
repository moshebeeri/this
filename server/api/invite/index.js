'use strict';

var express = require('express');
var controller = require('./invite.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('invite/user/:user_id', controller.invite_user);
router.get('invite/group/:group_id', controller.invite_group);

module.exports = router;
