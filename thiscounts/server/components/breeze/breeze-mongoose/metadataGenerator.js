// region Import

var Schema    = require('mongoose').Schema,
    _         = require('lodash'),
    inflect   = require('i')(true);


// endregion

// region Consts

var MODEL_NAMESPACE,
    IGNORE_PROPEERTIES = ['_id', '__v'],
    FOREIGN_KEY_SUFFIX = 'ID';

// endregion

// regionInner Fields

var structuralTypes = [],
    resourceEntityTypeMap = {};

// endregion

// region Inner Methods

/**
 * Returns json representing metadata about our db
 * model that breezeJS will understand on the front-end
 */
function getMetadata(dbModels){
    _reset();
    _createStructuralType(dbModels);

    return {
        metadataVersion: "1.0.5",
        structuralTypes: structuralTypes,
        resourceEntityTypeMap: resourceEntityTypeMap
    };
}

function _reset(){
    structuralTypes = [];
    resourceEntityTypeMap = {};
}

/**
 * Iterates over the given list of mongoose models and creates the corresponding metadata object
 * @param models
 * @private
 */
function _createStructuralType(models){
    _.forOwn(models, function(model){
        _parseEntitySchema(model.modelName, model.schema.tree, { autoGeneratedKeyType: 'Identity' });
        resourceEntityTypeMap[inflect.pluralize(model.modelName)] = _getFullPropertyName(model.modelName);
    });
}


/**
 * Parses the given set of properties
 * @param modelName
 * @param schema
 * @param isComplexType
 * @private
 */
function _parseEntitySchema(modelName, properties, structuralType){
    var skippedProperties = IGNORE_PROPEERTIES;

    structuralType.shortName = modelName;
    structuralType.namespace = MODEL_NAMESPACE;
    structuralType.dataProperties = [];
    structuralType.navigationProperties = [];

    _.forOwn(properties, function(property, key){
        skippedProperties = structuralType.isComplexType
            ? skippedProperties.concat(['id'])
            : skippedProperties;

        if(skippedProperties.indexOf(key) !== -1){ return; }

        if(_isComplexType(property)){
            if(property[0] instanceof Schema){ // it has a schema of another model
                _parseEntitySchema(_toPascalCase(key), property[0].tree, { isComplexType: true });
            } else { // it is a pure object
                _parseEntitySchema(_toPascalCase(key), Array.isArray(property) ? property[0] : property, { isComplexType: true });
            }
        }

        var propertyInfo = _getDataProperty(property, key);

        if(propertyInfo.isForeignKey){
            structuralType.navigationProperties.push(_getForeignKeyInfo(property, modelName, key));
        }
        structuralType.dataProperties.push(propertyInfo.prop);

    });

    structuralTypes.push(structuralType);
}

/**
 * Checks if the given property forms a complexType
 * @param property
 * @private
 */
function _isComplexType(property){
    return (Array.isArray(property)&& (property[0] instanceof Schema || _.isPlainObject(property[0])))
        || (_.isPlainObject(property) && !property.type);
}

/**
 * Turns the given property name to pascal case
 * @param propertyName
 * @private
 */
function _toPascalCase(propertyName){
    return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
}

/**
 * Returns the full name of the property
 * @param propName
 * @returns {string}
 * @private
 */
function _getFullPropertyName(propName){
    return propName + ':#' + MODEL_NAMESPACE;
}

/**
 * gets property information that will be added to metadata
 * @param property
 * @param propertyName
 * @private
 */
function _getDataProperty(property, propertyName){
    var isScalar = !(property instanceof Array),
        propertyInfo = {
            name: propertyName
        },
        isForeignKey =false;

    if(!isScalar){
        propertyInfo.isScalar = false;
    }

    if(_isComplexType(property)){
        propertyInfo.complexTypeName = _getFullPropertyName(_toPascalCase(propertyName));
    } else if(propertyName === 'id'){
        propertyInfo.isPartOfKey = true;
        propertyInfo.dataType = 'String';
    } else if(_isForeignKey(property)) {
        // ToDo: a foreign key can be an object with a type and ref property. Change this code to reflect that fact!!!
        propertyInfo.dataType = 'String'; // foreign key
        isForeignKey = true;
    } else {
        propertyInfo.dataType = _getDataType(property);
    }
    // validation properties

    var dataType;
    dataType = _getTypeValidation(propertyInfo.dataType);

    if(_getDataRequired(property)){
      propertyInfo.validators = [];
      propertyInfo.validators[0] = {"name" : "required"};
    }

    propertyInfo.defaultValue = _getDataEnum(property);

    //propertyInfo.defaultValue = _getDataDefault(property);

    if(_getDataUnique(property)){
      if(propertyInfo.custom === undefined) {
        propertyInfo.custom = [];
      }
      propertyInfo.custom[propertyInfo.custom.length] = {"unique" : true};
    }

    if(_getNumberMax(property) || _getNumberMin(property)){

      if(propertyInfo.validators === undefined) {
        propertyInfo.validators = [];
      }
      propertyInfo.validators[propertyInfo.validators.length] = {"name" : dataType, "min" : _getNumberMin(property), "max" : _getNumberMax(property)};
    }

    if(_getStringMaxLength(property) || _getStringMinLength(property)){
      if(propertyInfo.validators === undefined) {
        propertyInfo.validators = [];
      }
      propertyInfo.validators[propertyInfo.validators.length] = {"name" : dataType, "MinLength" : _getStringMinLength(property), "MaxLength" : _getStringMaxLength(property)};
    }

    if(_getStringMaxLength(property)){
      if(propertyInfo.validators === undefined) {
        propertyInfo.validators = [];
      }
      if(typeof _getStringMaxLength(property) === "number"){
        propertyInfo.maxLength = _getStringMaxLength(property);
      }

    }

    if(_getStringMatch(property)){
      if(propertyInfo.validators === undefined) {
        propertyInfo.validators = [];
      }
      propertyInfo.validators[propertyInfo.validators.length] = {"name" : dataType, "match" : _getStringMatch(property)};
    }
/*
    if(_getValidateFunction(property)){
      if(propertyInfo.custom === undefined) {
        propertyInfo.custom = [];
      }
      propertyInfo.custom[propertyInfo.custom.length] = {"name" : dataType, "function" : _getStringMatch(property)};
    }
*/

    return {
        prop: propertyInfo,
        isForeignKey: isForeignKey
    };
}

function _getTypeValidation(prop){
  switch(prop) {
    case "String":
      return 'string';
    case "Decimal":
      return 'number';
    case "Binary":
      return 'none';
    case "DateTime":
      return 'date';
    case "Boolean":
      return 'bool';
    case "Array":
      return 'array';
    default:
      return 'string';
  }
}
/**
 * Checks if the given property is a foreign key
 * @param property
 * @private
 */
function _isForeignKey(property){
    return property.type === Schema.ObjectId
        || property.name === 'ObjectId'
        || ( property[0] && property[0].name === 'ObjectId'); // is array of foreign keys
}

/**
 * Forms a structure that describes a foreign key information
 * @param property
 * @param modelName
 * @param foreignKeyName
 * @private
 */
function _getForeignKeyInfo(property, modelName, foreignKeyName){
    // The convention is that all foreign key names end in ID !!!
    var isScalar = !Array.isArray(property),
        foreignKeyModelName = foreignKeyName.split(FOREIGN_KEY_SUFFIX)[0],
        normalizedForeignKeyModelName = isScalar
            ? foreignKeyModelName
            : inflect.singularize(foreignKeyModelName);

    return {
        name: normalizedForeignKeyModelName, // the client side name of this property
        entityTypeName: _getFullPropertyName(_toPascalCase(normalizedForeignKeyModelName)),
        associationName: 'FK_' + _toPascalCase(modelName) + '_' + _toPascalCase(normalizedForeignKeyModelName),
        foreignKeyNames: [foreignKeyName]
    };
}

/**
 * Returns the breeze counterpart of the given type
 * @param type
 * @private
 */
function _getDataType(prop) {
    var mongooseType = prop.type || prop;

    if(mongooseType instanceof Array){
        mongooseType = prop[0];
    }

    switch(mongooseType) {
        case String:
            return 'String';
        case Number:
            return 'Decimal';
        case Buffer:
            return 'Binary';
        case Date:
            return 'DateTime';
		    case Boolean:
            return 'Boolean';
        case Array:
          return 'Array';
        default:
            return 'complexTypeName';
    }
}

/**
 * Returns required: true/false
 * @param required
 * @private
 */
function _getDataRequired(prop) {
  var mongooseType = prop.required || '';

  if(mongooseType !='' && mongooseType instanceof Array){
    mongooseType = prop[0];
  }
  switch(mongooseType) {
    case true:
      return true;
    case false:
      return false;
    default:
      return false;
  }
}

/**
 * Returns enum data
 * @param enum
 * @private
 */
function _getDataEnum(prop) {
  var mongooseType = prop.enum || '';

  if(mongooseType !='' && mongooseType instanceof Array){
    return prop.enum;
  } else return;
}

/**
 * Returns default data
 * @param default
 * @private
 */
function _getDataDefault(prop) {
  var mongooseType = prop.default || '';

  if(mongooseType !='' && mongooseType instanceof Array){
    return prop.default;
  } else return;
}

/**
 * Returns Unique: true/false
 * @param unique
 * @private
 */
function _getDataUnique(prop) {
  var mongooseType = prop.unique || '';

  if(mongooseType !='' && mongooseType instanceof Array){
    mongooseType = prop[0];
  }
  switch(mongooseType) {
    case true:
      return true;
    case false:
      return false;
    default:
      return false;
  }
}

/**
 * Returns maxlength string
 * @param maxlength
 * @private
 */
function _getStringMaxLength (prop) {
  var mongooseType = prop.maxlength || '';

  if(mongooseType !=''){
    return prop.maxlength;
  } else return;
}

/**
 * Returns maxlength string
 * @param maxlength
 * @private
 */
function _getStringMinLength (prop) {
  var mongooseType = prop.minlength || '';

  if(mongooseType !=''){
    return prop.minlength;
  } else return;
}

function _getStringMatch (prop) {
  var mongooseType = prop.match || '';

  if(mongooseType !=''){
    return prop.match;
  } else return;
}

/**
 * Returns max number
 * @param max
 * @private
 */
function _getNumberMax(prop) {
  var mongooseType = prop.max || '';

  if(mongooseType !=''){
    return prop.max;
  } else return;
}

/**
 * Returns max number
 * @param max
 * @private
 */
function _getNumberMin (prop) {
  var mongooseType = prop.max || '';

  if(mongooseType !=''){
    return prop.min;
  } else return;
}


/**
 * Returns validate function
 * @param max
 * @private
 */
function _getValidateFunction (prop) {
  var mongooseType = prop.validate || '';

  if(mongooseType !=''){
    return prop.validate;
  } else return;
}




// endregion

// region Export

module.exports = function(namespace){
    MODEL_NAMESPACE = namespace;

    return {
        getMetadata: getMetadata
    };
}

// endregion
