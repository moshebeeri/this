'use strict';

let express = require('express');
let controller = require('./category.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/work', controller.work);
router.get('/product', controller.product);
router.get('/business', controller.business);
router.get('/create/business', controller.create_business);
router.get('/top/business', controller.top_business);
router.get('/sub/business', controller.sub_business);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
