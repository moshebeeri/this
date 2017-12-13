'use strict';

let express = require('express');
let controller = require('./category.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/by/id/:lang/:id', auth.isAuthenticated(), controller.categoryById);
router.get('/translate/:to'/*, auth.isAuthenticated()*/, controller.translate);
router.get('/work/:function', auth.isAuthenticated(), controller.work);
router.get('/product/:lang/:parent', auth.isAuthenticated(), controller.product);
router.get('/business/:lang/:parent', auth.isAuthenticated(), controller.business);
router.post('/add/product/:parent', auth.isAuthenticated(), controller.add_product);
router.post('/add/business/:parent', auth.isAuthenticated(), controller.add_business);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
