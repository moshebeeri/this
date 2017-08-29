'use strict';

let express = require('express');
let controller = require('./qrcode.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

//TODO: change to auth.hasRole('admin') for production
router.get('/allocate/:quantity', auth.isAuthenticated(), controller.allocate);

router.get('/find/:code', auth.isAuthenticated(), controller.code);
router.post('/assign/:code', auth.isAuthenticated(), controller.assign);
router.post('/allocateOneAndAssign', auth.isAuthenticated(), controller.allocateOneAndAssign);
router.get('/image/:code', /*auth.isAuthenticated(),*/ controller.image);

module.exports = router;