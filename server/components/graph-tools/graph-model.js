'use strict';

var _ = require('lodash');
var db = require('seraph')({  server: "http://localhost:7474",
                              user: "neo4j",
                              pass: "saywhat" });

var seraph_model = require('seraph-model');
var logger = require('../logger').createLogger();
var util = require('util');


function GraphModel(class_name) {
  this.model = seraph_model(db, class_name);
}

GraphModel.prototype.connect = function connect(){
  logger.info("--> Connect to GraphModel <--");
};

GraphModel.prototype.reflect = function reflect(object, g_object, callback) {
  this.model.save(g_object, function(err, in_graph) {
    if(err) callback(err, null );
    object.gid = in_graph.id;
    object.save(function (err) {});
    callback(null, object )
  });
};

GraphModel.prototype.save = function save(object, callback) {
  this.model.save(object, function(err, object) {
    if(err) callback(err, object );
    callback(null, object);
    logger.info('object created gid: ' + object.id)
  });
};

GraphModel.prototype.db = function get_db() {
  return db;
};

GraphModel.prototype.model = function get_model() {
  return this.model;
};

/**
 *
 * @param from
 * @param name
 * @param to
 * @param properties
 * @param callback
 *
 * @see https://github.com/brikteknologier/seraph#rel.create
 *
 * db.relate(1, 'knows', 2, { for: '2 months' }, function(err, relationship) {
 *   assert.deepEqual(relationship, {
 *     start: 1,
 *     end: 2,
 *     type: 'knows',
 *     properties: { for: '2 months' },
 *     id: 1
 *   });
 * });
 */
GraphModel.prototype.relate = function relate(from, name, to, properties, callback){
  return db.relate(from, name, to, properties, callback);
};


GraphModel.prototype.unrelate = function unrelate(from, name, to){
  var query = " MATCH (f)-[r:{name}]->(t) \
                WHERE id(f)={from} and id(t)={to} \
                delete r";
  db.query(query, {from: from, name: name, to: to}, function(err) {
    if (err) { logger.error(err.message); }
  });
};


//see http://stackoverflow.com/questions/24097031/cypher-returning-boolean-after-checking-whether-relationship-exist-between-two-n
GraphModel.prototype.is_related_ids = function relate(from, name, to, callback){
  var query = util.format("MATCH (me{_id:'%s'})-[f:%s]->(follower{_id:'%s'}) return sign(count(f)) as exists", from, name, to);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    callback(null, result[0].exists != 0)
  });
};


//"MATCH (me{_id:'%s'})-[f:%s]->(follower{_id:'%s'}) return sign(count(f))",
GraphModel.prototype.sample_count_ids = function sample_count_ids(from, name, limit, callback){
  var query = util.format("MATCH (me{_id:'%s'})-[f:%s]->(items) with distinct(items) " +
    "limit %d return collect(items) as items, count(items) as count",
    from, name, limit);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    callback(null, result)
  });
};

GraphModel.prototype.count_out_rel_id = function count_out_rel(from, name, callback) {
  var query = util.format("MATCH ({_id:'%s'})-[f:%s]->() return count(f) as count",
    from, name);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    callback(null, result[0].count)
  });
};

GraphModel.prototype.count_in_rel_id = function count_in_rel(name, to, callback) {
  var query = util.format("MATCH ()-[f:%s]->({_id:'%s'}) return count(f) as count",
    name, to);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    callback(null, result[0].count)
  });
};


/***
 * @param from
 * @param to
 * @param name
 * @param params
 *
 *   see http://stephenmuss.com/using-seraph-as-a-neo4j-client-in-nodejs/
 *   var query = [
 *   'CREATE (john:Person{id: {id1}, name: "John", age: 22})',
 *   'CREATE (sarah: Person{id: {id2}, name: "Sarah", age: 26})',
 *   'CREATE (alan: Person({id: {id3}, name: "Alan", age: 19}))',
 *   'CREATE (john)-[:KNOWS]->(sarah)-[:KNOWS]->(alan)',
 *   'RETURN john, sara, alan'
 *   ].join('\n');
 *
 *   db.query(query, {id1: 1, id2: 2, id3: 3}, function(err, results) {
 *    if (err) { return; }
 *      console.log(results[0].john, results[0].sarah, results[0].alan);
 *    });
 */
GraphModel.prototype.relate_ids = function relate_id(from, name, to, params){
  if(_.isUndefined(params))
    params = {};
  var query = util.format("MATCH (f { _id:'%s' }), (t { _id:'%s' }) CREATE UNIQUE (f)-[:%s %s]->(t)",from, to, name, JSON.stringify(params));
  db.query(query, function(err) {
    if (err) { logger.error(err.message); }
  });
};


GraphModel.prototype.unrelate_ids = function unrelate(from, name, to){
  var query = util.format("MATCH (f { _id:'{%s}' })-[r:{%s}]->(t { _id:'{%s}' }) delete r", from, name, to);
  db.query(query, function(err) {
    if (err) { logger.error(err.message); }
  });
};


GraphModel.prototype.follow_phone = function follow_phone(number, nick, userId){
  var query = util.format("MATCH (phone:user { phone:'%s' }), (u:user { _id:'%s' }) CREATE UNIQUE (phone)<-[r:FOLLOW {nick : '%s'}]-(u)", number,userId, nick);
  db.query(query, function(err) {
    if (err) { logger.error(err.message); }
  });
};

GraphModel.prototype.promotion_instance_id = function promotion_instance(user_id, promotion, callback){
  var query = util.format("MATCH (promotion { _id:'{%s}' })-[r:INSTANCE_OF]->(ins:instance) where r.by='%s' return inst", promotion._id, user_id);
  db.query(query, function(err, instance) {
    if (err) { callback(err, null) }
    else callback(null, instance)
  });
};

GraphModel.prototype.related_type_id = function related_type_id(start, name, ret_type, by_user_id, limit, callback){
  var query = util.format("MATCH (s { _id:'{%s}' })-[r:%s]->(ret:%s) where r.by='%s' return ret limit %d", start, name, ret_type, by_user_id, limit);
  db.query(query, function(err, related) {
    if (err) { callback(err, null) }
    else callback(null, related)
  });
};

GraphModel.prototype.query = function query(query, callback){
  db.query(query, callback);
};

module.exports = GraphModel;


// logger.info("g_object:" (JSON.stringify(g_object))
// object.gid = g_object.id;
// logger.info(this.class_name +": object.gid=" + object.gid);
// object.save(function (err) {
//   if (err) callback(err, object);
//   callback(null, object);


// Creates a new promotion in the DB.
// exports.create = function(req, res) {
//   Promotion.create(req.body, function(err, promotion) {
//     logger.info("Promotion.created : " + promotion._id);
//     if(err) { return handleError(res, err); }
//     logger.info("JSON.stringify=" + JSON.stringify(promotion, ["creator","name", "_id"]));
//     PromotionGraph.save(JSON.stringify(promotion), function(err, gpromotion) {
//         if(err) { return res.end(err.message); } //handleError(res, err); }
//         promotion.gid = gpromotion.id;
//         logger.info("promotion.gid=" + promotion.gid);
//         promotion.save(function (err) {
//           if (err) { return handleError(res, err); }
//           return res.json(200, promotion);
//       });
//     });
//   });
// };
