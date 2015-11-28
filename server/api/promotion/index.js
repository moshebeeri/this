'use strict';

var express = require('express');
var controller = require('./promotion.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/g/:id', controller.g);
router.get('/info/server/time', controller.server_time);
router.get('/like/:id/:uid', auth.isAuthenticated(), controller.like);
router.delete('/like/:id/:uid', auth.isAuthenticated(), controller.unfollow);
router.get('/realize/:id', auth.isAuthenticated(), controller.realize);
router.get('/use/:id', auth.isAuthenticated(), controller.use);



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
