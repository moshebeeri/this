'use strict';

let express = require('express');
let controller = require('./i18n.controller.js');
let auth = require('../../auth/auth.service');

let router = express.Router();

//methods should not be available for outsiders
router.get('/test', controller.test);
router.get('/load', controller.load);
router.get('/createI18N', controller.createI18N);
router.get('/term/:key/:lang/', controller.term);

router.get('/translate/:to', auth.hasRole('admin'), controller.translateAPI);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
