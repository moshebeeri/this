'use strict';

let express = require('express');
let controller = require('./promotion.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.post('/campaign', auth.isAuthenticated(), controller.create_campaign);

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.get('/list/create/by/user/:skip/:limit', auth.isAuthenticated(), controller.user_promotions);
router.get('/list/by/user/business', auth.isAuthenticated(), controller.user_business);
router.get('/list/by/business/:business_id/:from/:scroll', auth.isAuthenticated(), controller.business_promotions);
router.get('/list/:business_id/:campaign_id', auth.isAuthenticated(), controller.campaign_promotions);
router.post('/campaign', auth.isAuthenticated(), controller.create_campaign);

router.get('/action/:type/:entity', auth.isAuthenticated(), controller.get_action);
router.post('/action', auth.isAuthenticated(), controller.create_action);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

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
