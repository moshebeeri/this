'use strict';

var _ = require('lodash');
var db = require('seraph')({  server: "http://localhost:7474",
                              user: "neo4j",
                              pass: "saywhat" });

var seraph_model = require('seraph-model');
//var PromotionGraph = model(db, 'promotion');

var logger = require('../logger').createLogger();

function GraphModel(class_name) {
  //this.class_name = class_name;
  this.model = seraph_model(db, class_name);
  //this.connect();
}

GraphModel.prototype.connect = function connect(){
  logger.info("--> Connect to GraphModel <--");
};

GraphModel.prototype.reflect = function reflect(object, g_object, callback) {
  this.model.save(g_object, function(err, g_object) {
    if(err) callback(err, g_object );
    object.gid = g_object.id;
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

/***
 * @param uid
 * @param id
 * @param name
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
GraphModel.prototype.relate = function relate(from, name, to){
  var query =  "MATCH (f { _id:'{from}' }), (t { _id:'{to}' }) create (f)-[:'{name}']->(t)";
  db.query(query, {from: from, name: name, to: to}, function(err) {
    if (err) { logger.error(err.message); }
  });
};

GraphModel.prototype.unrelate = function unrelate(from, name, to){
  var query =  "MATCH (f { _id:'{from}' })-[r:'{name}']->(t { _id:'{id}' }) delete r";
  db.query(query, {from: from, name: name, to: to}, function(err) {
    if (err) { logger.error(err.message); }
  });
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
