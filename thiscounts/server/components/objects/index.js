'use strict';


let dataSet = {

};

const fieldName2CollectionName = {
  'actor_user': 'user',
  'user': 'user',
  'actor_group': 'group',
  'group': 'group'
};

function collectionName(key) {return fieldName2CollectionName[key];}

function dataSetCollection(collection){
  if(!dataSet[collection])
    dataSet[collection] = {};
  return dataSet[collection];
}

function dataGetCollection(collection){
  return dataSet[collection];
}

function disassembler(obj){
  Object.keys(obj).forEach(key => {
    let collection = collectionName(key);
    if(!collection || typeof obj[key] !== 'object') return;
    if(![obj[key]._id]) return;
    dataSetCollection(collection)[obj[key]._id] = obj[key];
    let objKey = obj[key];
    obj[key] = obj[key]._id;
    disassembler(objKey);
  });
  return obj;
}

function assembler(obj){
  Object.keys(obj).forEach(key => {
    let collection = collectionName(key);
    if(!collection) return console.log(`no collection for ${key}`);
    obj[key] = dataGetCollection(collection)[obj[key]];
    if(!obj[key]) return;
    assembler(obj[key]);
  });
  return obj;
}


exports.disassembler = function(obj, callback) {
  obj = disassembler(obj);
  console.log(JSON.stringify(obj));
  callback(null, dataSet, obj)
};

exports.assembler = function(obj, callback) {
  console.log(obj);
  obj =  assembler(obj);
  callback(obj)
};