'use strict';

let express = require('express');
let controller = require('./category.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/cid/:_id/:scroll', auth.isAuthenticated(), controller.feed);

//production, remove remark!!!
router.post('/', /*auth.hasRole('admin'),*/ controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
