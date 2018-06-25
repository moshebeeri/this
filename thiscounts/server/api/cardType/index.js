'use strict';

let express = require('express');
let controller = require('./cardType.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/list/:entity', auth.isAuthenticated(), controller.entity);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/invite/ask/:cardType/:user', auth.isAuthenticated(), controller.invite);
router.get('/invite/accept/:cardType', auth.isAuthenticated(), controller.inviteAccepted);

module.exports = router;
