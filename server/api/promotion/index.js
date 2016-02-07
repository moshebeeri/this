'use strict';

var express = require('express');
var controller = require('./promotion.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/info/server/time', controller.server_time);
router.get('/realize/:id', auth.isAuthenticated(), controller.realize);
router.get('/use/:id', auth.isAuthenticated(), controller.use);

router.get('/init/data', /*auth.isAuthenticated(),*/ controller.initialize);

module.exports = router;
/*
localhost:9000/api/users
{"username":"moshe.beeri@gmail.com",
 "password": "88fm"
}

return eyJ0eXAiOiJKV...

localhost:9000/api/promotions/like/1/2
Authorization Bearer eyJ0eXAiOiJKV...

*/
