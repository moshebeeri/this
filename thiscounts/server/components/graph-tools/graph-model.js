'use strict';

let _ = require('lodash');
let config = require('../../config/environment');

let db = require('seraph')({
  server: config.neo4j.uri,
  user: "neo4j",
  pass: "saywhat"
});

let seraph_model = require('seraph-model');
let logger = require('../logger').createLogger();
let util = require('util');
let utils = require('../utils').createUtils();
let async = require('async');


function GraphModel(class_name) {
  this.model = seraph_model(db, class_name);
}

GraphModel.prototype.connect = function connect(){
  logger.info("--> Connect to GraphModel <--");
};

GraphModel.prototype.reflect = function reflect(object, g_object, callback) {
  this.model.save(g_object, function(err, in_graph) {
    if(err) return callback(err, null );
    object.gid = in_graph.id;
    return object.save(callback);
  });
};

GraphModel.prototype.reflect_create = function reflect(object, create, callback) {
  db.query(object, function(err, in_graph) {
    if(err) return callback(err, null );
    object.gid = in_graph.id;
    object.save(function (err) {});
    return callback(null, object )
  });
};

GraphModel.prototype.save = function save(object, callback) {
  this.model.save(object, function(err, object) {
    if(err) return callback(err, object );
    return callback(null, object);
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
  let query = ` MATCH (f)-[r:{name}]->(t) 
                WHERE id(f)={from} and id(t)={to} 
                delete r;`;
  db.query(query, {from: from, name: name, to: to}, function(err) {
    if (err) { logger.error(err.message); }
  });
};

//see http://stackoverflow.com/questions/24097031/cypher-returning-boolean-after-checking-whether-relationship-exist-between-two-n
GraphModel.prototype.is_related_ids = function relate(from, name, to, callback){
  let query = util.format("MATCH (me{_id:'%s'})-[f:%s]->(follower{_id:'%s'}) return sign(count(f)) as exists", from, name, to);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result[0] && result[0].exists !== 0)
  });
};

GraphModel.prototype.is_promotion_realized = function(user_id, promotion_id, callback) {
  let query = `match (p:promotion{_id:'${promotion_id}'})<-[:INSTANCE_OF]-(:instance)<-[:SAVE_OF]-(sv:SavedInstance)<-[:REALIZED]-(u:user{_id:'${user_id}'}) 
              return sign(count(sv)) as exists`;
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result[0] && result[0].exists !== 0)
  });
};

GraphModel.prototype.promotion_realized_count = function(promotion_id, callback){
  let query = `match (p:promotion{_id:'${promotion_id}'})<-[:INSTANCE_OF]-(:instance)<-[:SAVE_OF]-(sv:SavedInstance)<-[:REALIZED]-(u:user) 
              return count(sv) as count`;
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result[0]? result[0].count : 0)
  });
};

//"MATCH (me{_id:'%s'})-[f:%s]->(follower{_id:'%s'}) return sign(count(f))",
GraphModel.prototype.sample_count_ids = function sample_count_ids(from, name, limit, callback){
  let query = util.format("MATCH (me{_id:'%s'})-[f:%s]->(items) with distinct(items) " +
    "limit %d return collect(items) as items, count(items) as count",
    from, name, limit);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result)
  });
};

GraphModel.prototype.count_out_rel_id = function count_out_rel(from, name, callback) {
  let query = util.format("MATCH ({_id:'%s'})-[f:%s]->() return count(f) as count",
    from, name);
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    callback(null, result[0]? result[0].count : 0)
  });
};

GraphModel.prototype.count_in_rel_id = function count_in_rel(name, to, callback) {
  const query = `MATCH ()-[f:${name}]->({_id:'${to}'}) return count(f) as count`;
  db.query(query, function(err, result) {
    if (err) {
      console.error(err);
      return callback(err) }
    return callback(null, result[0]? result[0].count : 0)
  });
};
/**
 * @param to _id of the item
 * @param rel the relation queering
 * @param rel_between optional internal relation, if *1..x keep x low
 * @param callback returns count
 *
 * MATCH (p{_id:'59f999d90f8fe084572f2407'})<-[direct_comments:COMMENTED]-()
 * OPTIONAL MATCH (p)<-[:INSTANCE_OF]-()<-[indirect_comments:COMMENTED]-()
 * return count(direct_comments)+count(indirect_comments) as count
 */
GraphModel.prototype.count_in_though = function count_in_rel(to, rel, rel_between, callback) {
  let query = ` MATCH (e{_id:'${to}'})<-[direct:${rel}]-()
                WITH count(direct) as directs
                OPTIONAL MATCH (e{_id:'${to}'})<-[:${rel_between}]-()<-[indirect:${rel}]-()
                RETURN directs + count(indirect) as count`;
  // query =   `MATCH (p{_id:'${to}'})<-[direct:${rel}]-()
  //             OPTIONAL MATCH (p)<-[:${rel_between}]-()<-[indirect:${rel}]-()
  //             return count(direct)+count(indirect) as count`;
  db.query(query, function(err, result) {
    if (err) { return callback(err) }
    return callback(null, result[0]? result[0].count : 0 )
  });
};

/***
 * @param from
 * @param to
 * @param name
 * @param params - optional
 * @param callback - optinal
 *
 *   see http://stephenmuss.com/using-seraph-as-a-neo4j-client-in-nodejs/
 *   let query = [
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
GraphModel.prototype.relate_ids = function relate_id(from, name, to, params, callback) {
  if(typeof params === 'function'){
    callback = params;
    params = null;
  }

  if (!utils.defined(params) || typeof params !== 'string')
    params = ''; //`{timestamp: "${Date.now()}"}`;

  let query = 'MATCH (f { _id:"' + from + '"}), (t { _id:"' + to + '"}) CREATE UNIQUE (f)-[:' + name + params + ']->(t)';
  if (utils.defined(callback)) {
    db.query(query, callback);
  } else {
    db.query(query, function (err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
};

GraphModel.prototype.unrelate_ids = function unrelate_ids(from, name, to, callback){
  let query = `MATCH (f { _id:'${from}' })-[r:${name}]->(t { _id:'${to}' }) delete r`;
  if (utils.defined(callback)) {
    db.query(query, callback);
  } else {
    db.query(query, function (err) {
      if (err) logger.error(err.message);
    });
  }
};

/***
 *
 * @param number
 * @param userId
 * @param callback - optional
 */
GraphModel.prototype.follow_user_by_phone_number = function follow_user_by_phone_number(number, userId, callback){
  let query = util.format("MATCH (phone:user { phone:'%s' }), (u:user { _id:'%s' }) CREATE UNIQUE (phone)-[r:FOLLOW]->(u)", number,userId);
  if (utils.defined(callback)) {
    db.query(query, callback);
  } else {
    db.query(query, function (err) {
      if (err) logger.error(err.message);
    });
  }
};

/***
 * @param owner_id
 * @param follower_id - optional, if not set then will connect all follower operation that may be costly
 */
GraphModel.prototype.owner_followers_follow_business = function owner_followers_follow_business(owner_id, follower_id, callback){
  if(typeof follower_id === 'function'){
    callback = follower_id;
    follower_id = null;
  }
  let userFilter = utils.undefined(follower_id)? '' : `{ _id:'${follower_id}'}`;

  let query = `MATCH (u:user ${userFilter})-[:FOLLOW]->(owner:user { _id:'${owner_id}' })-[:ROLE{name:'OWNS'}]->(b:business)-[:DEFAULT_GROUP]->(g:group)
                WHERE b.type = 'SMALL_BUSINESS' OR b.type = 'PERSONAL_SERVICE'
                CREATE UNIQUE (u)-[:FOLLOW]->(b)-[:FOLLOW]->(g)  ` ;

  if (utils.defined(callback)) {
    db.query(query, callback);
  } else {
    db.query(query, function (err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
};

GraphModel.prototype.owner_followers_follow_default_group = function owner_followers_follow_default_group(owner_id, callback){
  let query = `MATCH (u:user)-[:FOLLOW]->(owner:user { _id:'${owner_id}' })-[:ROLE{name:"OWNS"}]->(b:business)-[:DEFAULT_GROUP]->(g)
                WHERE b.type = 'SMALL_BUSINESS' OR b.type = 'PERSONAL_SERVICE'   
                CREATE UNIQUE (u)-[r:FOLLOW]->(g)`;

  if (utils.defined(callback)) {
    db.query(query, callback);
  } else {
    db.query(query, function (err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
};

GraphModel.prototype.promotion_instance_id = function promotion_instance(user_id, promotion, callback){
  let query = util.format("MATCH (promotion { _id:'{%s}' })-[r:INSTANCE_OF]->(ins:instance) where r.by='%s' return inst", promotion._id, user_id);
  db.query(query, function(err, instance) {
    if (err) { callback(err, null) }
    else callback(null, instance)
  });
};

GraphModel.prototype.related_type_id = function related_type_id(start, name, ret_type, skip, limit, callback){
  db.query(this.related_type_id_dir_query(start, name, ret_type, '', skip, limit),callback);
};

GraphModel.prototype.related_type_id_dir_query = function related_type_id_dir_query(start, name, ret_type, dir, skip, limit) {
  let match = "MATCH (s { _id:'%s' })-[r:%s]-(ret:%s) ";
  if(dir==="out")
    match = "MATCH (s { _id:'%s' })-[r:%s]->(ret:%s) ";
  else if(dir==="in")
    match = "MATCH (s { _id:'%s' })<-[r:%s]-(ret:%s) ";
  return util.format(
    match +
    "return ret._id as _id " +
    "ORDER BY r.timestamp DESC " +
    "skip %d limit %d", start, name, ret_type, skip, limit);
};

GraphModel.prototype.paginate_query = function(query, skip, limit){
  return `${query} skip ${skip} limit ${limit}`
};

GraphModel.prototype.order_by_query = function(query, order){
  return `${query} ORDER BY ${order}`
};

GraphModel.prototype.order_by_paginate_query = function(query, order, skip, limit){
  return this.paginate_query(this.order_by_query(order), skip, limit)
};

GraphModel.prototype.related_type_id_dir = function related_type_id_dir(start, name, ret_type, dir, skip, limit, callback){
  db.query(
    this.related_type_id_dir_query(start, name, ret_type, dir, skip, limit),
    function(err, related) {
      if (err) { return callback(err, null) }
      return callback(null, related)
  });
};

GraphModel.prototype.incoming_ids = function related_incoming_ids(start, name, ret_type, skip, limit, callback){
  let query = util.format(
    "MATCH (s { _id:'{%s}' })<-[r:%s]-(ret:%s) " +
    "return ret._id as _id" +
    "ORDER BY r.name DESC " + //TODO: make order an input
    "skip %d limit %d", start, name, ret_type, skip, limit);
  db.query(query, function(err, related) {
    if (err) { return callback(err, null) }
    return callback(null, related)
  });
};

// util.format("MATCH (s { _id:'{%s}' })<-[r:%s]-(ret:%s) " + "return ret._id ", start, name, ret_type)
//"ORDER BY r.name DESC " +
GraphModel.prototype.query_ids = function query_ids(query, order, skip, limit, callback){
  let query_str  = util.format("%s %s skip %d limit %d", query, order, skip, limit);
  db.query(query_str, function(err, related) {
    if (err) { return callback(err, null) }
    return callback(null, related)
  });
};

GraphModel.prototype.query_ids_relation = function query_ids(from_id, rel, to_id, ret, callback){
  let query = util.format(
    "MATCH (from_id{ _id:'{%s}' })-[r:%s]->(to_id:%s) " +
    "return r%s ", from_id, rel, to_id, ret!==''? '.' + ret:'');
  db.query(query, function(err, related) {
    if (err) { return callback(err, null) }
    return callback(null, related)
  });
};

GraphModel.prototype.query_objects = function query_objects(schema, query, order, skip, limit, callback){
  this.query_ids(query, order, skip, limit, function(err, _ids) {
    if (err) { callback(err, null) }
    if(!_ids) _ids = [];
    schema.find({}).where('_id').in(_ids).exec(function (err, objects) {
      if (err) { return callback(err, null) }
      return callback(null, objects)
    });
  });
};

function make_schema_query_function(schema, _ids){
  return function(callback){
    schema.find({}).where('_id').in(_ids).exec(function (err, objects) {
      if (err) return callback(err, null);
      return callback(null, objects)
    });
  }
}

GraphModel.prototype.query_objects_parallel = function query_objects_parallel(schemas, query, callback){
  db.query(query, function(err, table) {
    if (err) { callback(err, null) }
    let acc = {};
    Object.keys(table[0]).forEach(k => acc[k] = new Set());
    let reduced = table.reduce(function (acc, obj) {
      Object.keys(obj).forEach(k => acc[k].add(obj[k]));
      return acc;
    }, acc);
    let queryFunctions = [];
    Object.keys(reduced).forEach( key => {
      (function (schema, _ids) {
        queryFunctions.push(make_schema_query_function(schema, _ids));
      })(schemas[key], Array.from(reduced[key]));
    });
    return async.parallel(queryFunctions, function(err, result) {
      if (err) return callback(err, null);
      return callback(null, result)
    });
  });
};


GraphModel.prototype.query_objects_general = function query_objects_general(schema, query, callback){
  db.query(query, function(err, _ids) {
    if (err) { callback(err, null) }
    schema.find({}).where('_id').in(_ids).exec((err, objects) =>{
      if (err) { return callback(err, null) }
      return callback(null, objects)
    });
  });
};

GraphModel.prototype.followers = function followers(userId, skip, limit, callback){
  this.related_type_id_dir(userId, 'FOLLOW', 'user', 'in', skip, limit, callback);
};

GraphModel.prototype.following = function following(userId, skip, limit, callback){
  this.related_type_id_dir(userId, 'FOLLOW', 'user', 'out', skip, limit, callback);
};

GraphModel.prototype.followers_query = function followers(userId, skip, limit){
  return this.related_type_id_dir_query(userId, 'FOLLOW', 'user', 'in', skip, limit);
};

GraphModel.prototype.following_query = function following(userId, skip, limit){
  return this.related_type_id_dir_query(userId, 'FOLLOW', 'user', 'out', skip, limit);
};


GraphModel.prototype.query = function query(query, callback){
  db.query(query, callback);
};

module.exports = GraphModel;
