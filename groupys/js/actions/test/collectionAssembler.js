/**
 * Created by roilandshut on 04/09/2017.
 */
const fieldName2CollectionName = {
    'actor_user': 'user',
    'user': 'user',
    'actor_group': 'group',
    'group': 'group',
    'promotion': 'promotion',
    'instance': 'instance',
    'product': 'product',
    'business': 'business',
    'activity': 'activity',
    'actor_business':'business',
};

const nameToCollections = {
    'promotion':'promotions',
    'actor_business':'businesses',
    'business':'businesses',
    'activity':'activities',
    'instance':'instances',
    'actor_user':'user',
    'user':'user',
};



function collectionName(key) {return fieldName2CollectionName[key];}
//function nameToCollection(key) {return nameToCollections[key];}
function nameToCollection(key) {return fieldName2CollectionName[key];}
let dataSet = {

};

function getCollection(collection){
    if(!dataSet[collection])
        dataSet[collection] = {};
    return dataSet[collection];
}


function dataSetCollection(dispatch,collection,object){
    // let actionType = 'UPSERT'+collection;
    // if(dispatch) {
    //     //console.log(actionType)
    //     dispatch({
    //         type: actionType,
    //         item: object,
    //     });
    // }
    //console.log(JSON.stringify(object, null, '\t'));
    getCollection(collection)[object._id] = object;
}


function dataGetCollection(collections,collection){
    //return collections[collection];
    return getCollection(collection);
}

function immutableObject(obj){
    return JSON.parse(JSON.stringify(obj))
}
module.exports.disassembler = function disassembler(input,dispatch){
    let obj = immutableObject(input);
    Object.keys(obj).forEach(key => {
        let collection = collectionName(key);
        if( obj[key] && typeof obj[key] === 'object'){
            if(!obj[key]._id ) {
                obj[key] = disassembler(obj[key], dispatch);
            }else if(collection){
                let objKey = obj[key];
                obj[key] = obj[key]._id;
                objKey = disassembler(objKey, dispatch);
                dataSetCollection(dispatch,collection,objKey);
            }
        }
    });
    return obj;
};
module.exports.printState =  function(){
    console.log(JSON.stringify(dataSet, null, '\t'));
};
module.exports.assembler =  function(input,collections){
    let obj = immutableObject(input);
    Object.keys(obj).forEach(key => {
        let collection = nameToCollection(key);
        if(!collection) return ;
        obj[key] = dataGetCollection(collections,collection)[obj[key]];
        if(!obj[key]) return;
        console.log(key);
        this.assembler(obj[key],collections);
    });
    return obj;
};