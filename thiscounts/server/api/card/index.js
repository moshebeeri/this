'use strict';

let express = require('express');
let controller = require('./card.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/charge/code/:cardId', auth.isAuthenticated(), controller.chargeCode);
router.get('/charge/:code/:points', auth.isAuthenticated(), controller.charge);
router.get('/redeem/:code/:points', auth.isAuthenticated(), controller.redeem);
router.get('/list/mine', auth.isAuthenticated(), controller.mine);
router.get('/touch/:cardId', auth.isAuthenticated(), controller.touch);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/:cardTypeId', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
