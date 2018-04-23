const dataSet = {};
const fieldName2CollectionName = {
    'actor_user': 'user',
    'user': 'user',
    'actor_group': 'group',
    'group': 'group',
    'promotion': 'promotion',
    'post':'post',
    'instance': 'instance',
    'product': 'product',
    'business': 'business',
    'activity': 'activity',
    'message_activity': 'activity',
    'actor_business': 'business',
};
const nameToCollections = {
    'promotion': 'promotions',
    'actor_business': 'businesses',
    'business': 'businesses',
    'post':'posts',
    'activity': 'activities',
    'instance': 'instances',
    'product': 'products',
    'actor_user': 'user',
    'user': 'user',
};

const excludeKeys = ['values'];



function collectionName(key) {
    return fieldName2CollectionName[key];
}

function nameToCollection(key) {
    return nameToCollections[key];
}

function dataSetCollection(dispatch, collection, object) {
    let actionType = 'UPSERT' + collection;
    dispatch.dispatch({
        type: actionType,
        item: object,
    });
}

function dataGetCollection(collections, collection) {
    return collections[collection];
}

export function immutableObject(obj) {
    return {
        ...obj
    }
}

export function disassembler(input, dispatch) {
    let obj = immutableObject(input);
    Object.keys(obj).forEach(key => {
        let collection = collectionName(key);
        if (obj[key] && typeof obj[key] === 'object') {
            if (!obj[key]._id) {
                obj[key] = disassembler(obj[key], dispatch);
            } else if (collection) {
                let objKey = obj[key];
                obj[key] = obj[key]._id;
                objKey = disassembler(objKey, dispatch);
                dataSetCollection(dispatch, collection, objKey);
            }
        }
    });
    return obj;
}

export function assembler(input, collections) {
    let obj = immutableObject(input);
    Object.keys(obj).forEach(key => {
        let collection = nameToCollection(key);
        if (!collection) {
            if (obj[key] && typeof obj[key] === 'object' && !excludeKeys.includes(key) )
                obj[key] = assembler(obj[key], collections);
        } else {
            obj[key] = dataGetCollection(collections, collection)[obj[key]];
            if (!obj[key]) return obj;
            obj[key] = assembler(obj[key], collections);
        }
    });
    return obj;
}