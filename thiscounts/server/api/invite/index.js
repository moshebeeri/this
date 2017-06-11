'use strict';

let express = require('express');
let controller = require('./invite.controller.js');

let router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('invite/user/:user_id', controller.invite_user);
router.get('invite/group/:group_id', controller.invite_group);

module.exports = router;
