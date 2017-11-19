'use strict';

let express = require('express');
let controller = require('./video.controller.js');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.post('/:id', auth.isAuthenticated(), controller.upload);
router.post('/youtube/:id/:youtube', auth.isAuthenticated(), controller.youtube);

// router.get('/test', controller.test);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
//router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
