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
//router.get('/info/server/time', controller.server_time);
router.get('/save/:id', auth.isAuthenticated(), controller.save);
router.get('/realize/:id/:realize_code/:sale_point_code', auth.isAuthenticated(), controller.realize);

// router.get('/init/data', /*auth.isAuthenticated(),*/ controller.initialize);
// router.get('/test/graph', controller.test);

module.exports = router;
/*
localhost:9000/api/users
{"username":"moshe.beeri@gmail.com",
 "password": "88fm"
}

return eyJ0eXAiOiJKV...

localhost:9000/api/promotions/like/1/2
Authorization Bearer eyJ0eXAiOiJKV...

https://github.com/mongodb-labs/mongo-connector/wiki/Getting-Started

*/
//https://github.com/mongodb-labs/mongo-connector/wiki/Usage%20with%20ElasticSearch
// http://stackoverflow.com/questions/27187591/deploy-mongodb-replicaset-servers-with-docker-on-different-physical-servers
// mongod --port 27017 --dbpath /srv/mongodb/rs0-0 --replSet rs0 --smallfiles --oplogSize 128
// mongod --port 27018 --dbpath /srv/mongodb/rs0-1 --replSet rs0 --smallfiles --oplogSize 128
// mongo-connector -m localhost:27017 -t localhost:9200 -d elastic2_doc_manager

//https://docs.mongodb.org/manual/tutorial/force-member-to-be-primary/
