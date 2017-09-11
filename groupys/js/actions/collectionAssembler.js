/**
 * Created by roilandshut on 04/09/2017.
 */





const dataSet = {

};

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


}



function collectionName(key) {return fieldName2CollectionName[key];}
function nameToCollection(key) {return nameToCollections[key];}


function dataSetCollection(dispacth,collection,object){
    let actionType = 'UPSERT'+collection;
    console.log(actionType)
    dispacth({
        type: actionType,
        item: object,
    });
}

function dataGetCollection(collections,collection){
    return collections[collection];
}

export function imutableObject(obj){
    return{
        ...obj
    }
}
export function disassembler(input,dispatch){
    let obj = imutableObject(input)
    Object.keys(obj).forEach(key => {
        let collection = collectionName(key);
        if(!collection || typeof obj[key] !== 'object') return;
        if(![obj[key]._id]) return ;
        let objKey = obj[key];
        obj[key] = obj[key]._id;
        disassembler(objKey,dispatch)
        dataSetCollection(dispatch,collection,objKey);

    });
    return obj;
}

export function assembler(input,collections){
    let obj = imutableObject(input)
    Object.keys(obj).forEach(key => {
        let collection = nameToCollection(key);
        if(!collection) return ;
        obj[key] = dataGetCollection(collections,collection)[obj[key]];
        if(!obj[key]) return;
        assembler(obj[key],collections);
    });
    return obj;
}