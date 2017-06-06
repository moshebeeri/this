//see http://neo4j.com/developer/javascript/
let db = require('seraph')({
  server: "http://localhost:7474",
  user: "neo4j",
  pass: "saywhat"
});

let logger = require('../logger').createLogger();
let utils = require('../utils').createUtils();

function Spatial(create) {
  if(create)
    find_layer('world');
}

//MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r
function find_layer(name) {
  //if layer exist return
  let operation = db.operation('ext/SpatialPlugin/graphdb/getLayer', 'POST', {
    "layer": name
  });
  db.call(operation, function (err, result, response) {
    if (err) {
      console.log('name');
      create_layer(name);

    } else {
      logger.info("query layer result: ");
      logger.info(JSON.stringify(result, null, 4));
    }
  });
}

function create_layer(name) {
  //not exist then create the layer
  operation = db.operation('ext/SpatialPlugin/graphdb/addSimplePointLayer', 'POST', {
    "layer": name,
    "lat" : "lat",
    "lon" : "lon"
  });
  db.call(operation, function (err, result, response) {
    if(err) logger.info("failed to create layer: " + err);
    if (!err) {
      console.log('spatial layer created' + JSON.stringify(result));
      create_index(name);
      //layer === result;

    }
  });
}

function create_index(name) {
  this.index = null;
  //not exist then create the layer
  operation = db.operation('index/node', 'POST', {
    "name": name,
    "config":{
      "provider":"spatial",
      "geometry_type":"point",
      "lat":"lat",
      "lon":"lon"
    }
  });
  db.call(operation, function (err, result, response) {
    if(err) logger.info("failed to create index: " + err);
    if (!err) {
      console.log('spatial index created' + JSON.stringify(result));
      this.index = result;
    }
  });
  return index;
}


//curl -X POST -d '{"name":"geom","config":{"provider":"spatial","geometry_type":"point","lat":"lat","lng":"lng"}}' --header "Content-Type:application/json" http://localhost:7474/db/data/index/node/
//curl -X POST -d '{"key":"name","value":"Strandbar Hermann 2","uri":"http://localhost:7575/db/data/node/5"}' --header "Content-Type:application/json" http://localhost:7474/db/data/index/node/geom
Spatial.prototype.add2index = function add(gid, callback) {
  this.add(gid, callback);
  // let operation = db.operation('index/node/world', 'POST', {
  //   "key":"name",
  //   "value":"item_id",
  //   "uri": "http://localhost:7474/db/data/node/" + gid
  // });
  // db.call(operation, function (err, result, response) {
  //   if (!err) console.log('gid ' + gid + ' added to layer');
  //   callback(err, result);
  // });
};


/**
 *
 *  POST http://localhost:7575/db/data/ext/SpatialPlugin/graphdb/addNodeToLayer
 *    Accept: application/json; charset=UTF-8
 *  Content-Type: application/json
 *  {
 *    "layer" : "user",
 *    "node" : "http://localhost:7575/db/data/node/54"
 *  }
 */
Spatial.prototype.add = function add(gid, callback) {
  let operation = db.operation('ext/SpatialPlugin/graphdb/addNodeToLayer', 'POST', {
    "layer": "world",
    "node": "http://localhost:7474/db/data/node/" + gid
  });
  db.call(operation, function (err, result, response) {
    if (!err) console.log('gid ' + gid + ' added to layer world');
    callback(err, result);
  });
};

/**
 * POST http://localhost:7575/db/data/ext/SpatialPlugin/graphdb/addEditableLayer
 *  Accept: application/json; charset=UTF-8
 *  Content-Type: application/json
 *  {
 *    "layer" : "users",
 *    "format" : "WKT",
 *    "nodePropertyName" : "wkt"
 *  }
 * @param cb
 */
Spatial.prototype.cypher = function cypher(cypher, cb) {
  //let cypher = "START x = node({id}) "
  //  + "MATCH x -[r]-> n "
  //  + "RETURN n "
  //  + "ORDER BY n.name";

  db.query(cypher, {id: 1}, function (err, result) {
    if (err) cb(err);
    else cb(null, result);

    //assert.deepEqual(result, [
    //  { name: 'Katie', age: 29, id: 3 },
    //  { name: 'Neil', age: 60, id: 2 }
    //]);
  });
};

Spatial.prototype.location_to_point = function location_to_point(location_obj) {
  if(
    utils.defined(location_obj.lng)  &&
    utils.defined(location_obj.lat)   ){
    location_obj.location =  {
      type: 'Point',
      coordinates: [location_obj.lng, location_obj.lat],
      lng: location_obj.lng,
      lat: location_obj.lat
    }
  }
  else if( utils.defined(location_obj.location)      &&
    utils.defined(location_obj.location.lng)  &&
    utils.defined(location_obj.location.lat)   ){
    location_obj.location =  {
      type: 'Point',
      coordinates: [location_obj.location.lng, location_obj.location.lat],
      lng: location_obj.location.lng,
      lat: location_obj.location.lat
    }
  }
  else
    location_obj.location = {};
  return location_obj;
};

Spatial.prototype.geo_to_location = function geo_to_location(geo) {
  if( utils.defined(geo.lng)  &&
      utils.defined(geo.lat)   )
    return {
      type: 'Point',
      coordinates: [geo.lng, geo.lat],
      lng: geo.lng,
      lat: geo.lat
    };
  return {};
};


module.exports = Spatial;


////let neo4j = require('neo4j');
////let db = new neo4j.GraphDatabase('http://localhost:7474');
//
////https://github.com/philippkueng/node-neo4j
//let neo4j = require('node-neo4j');
//db = new neo4j('http://username:password@domain:port');
//
//// when using token based authentication introduced in Neo4j v2.2
////db = new neo4j('http://:your-authentication-token@domain:port');
//let r = require("request");
//let txUrl = "http://localhost:7474/db/data/transaction/commit";
//
//
//
///**
// *  Usage:
// *   let query="MATCH (n:User) RETURN n, labels(n) as l LIMIT {limit}"
// *   let params={limit: 10}
// *   let cb=function(err,data) { console.log(JSON.stringify(data)) }
// *   cypher(query,params,cb)
//*/
//Spatial.prototype.cypher = function cypher(query, params, cb) {
//  r.post({
//      uri: txUrl,
//      json: {statements: [{statement: query, parameters: params}]}
//    },
//    function (err, res) {
//      cb(err, res.body)
//    });
//};
//
//
//Spatial.prototype.initialize = function initialize() {
//  db.cypherQuery("START user = node(123) MATCH user-[:RELATED_TO]->friends RETURN friends", function (err, result) {
//    if (err) throw err;
//
//    console.log(result.data); // delivers an array of query results
//    console.log(result.columns); // delivers an array of names of objects getting returned
//  });
//
//  db.updateNode(12, {name: 'foobar2'}, function (err, node) {
//    if (err) throw err;
//
//    if (node === true) {
//      // node updated
//    } else {
//      // node not found, hence not updated
//    }
//  });
//
//};
//
//Spatial.prototype.node = function node() {
//  let node = db.createNode({hello: 'world'});     // instantaneous, but...
//  node.save(function (err, node) {    // ...this is what actually persists.
//    if (err) {
//      console.error('Error saving new node to database:', err);
//    } else {
//      console.log('Node saved to database with id:', node.id);
//    }
//  });
//
//};


