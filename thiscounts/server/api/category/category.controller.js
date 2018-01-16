'use strict';

const _ = require('lodash');
const Category = require('./category.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('category');
const async = require('async');
const BusinessRootCategory = graphTools.createGraphModel('BusinessRootCategory');
const BusinessTopCategory = graphTools.createGraphModel('BusinessTopCategory');
const BusinessCategory = graphTools.createGraphModel('BusinessCategory');
const ProductRootCategory = graphTools.createGraphModel('ProductRootCategory');
const ProductTopCategory = graphTools.createGraphModel('ProductTopCategory');
const ProductCategory = graphTools.createGraphModel('ProductCategory');
const EBayProductCategories = require('./data/product.category.ebay');
const translate = require('@google-cloud/translate');
const limit = require("simple-rate-limiter");

const Translate = translate({
  projectId: 'this-f2f45',
  keyFilename: './server/config/keys/this-vision.json'
});


function createProductCategoryRoot(callback) {
  ProductCategory.save({name: 'ProductRootCategory'}, callback)
}

function createProductCategoriesNode(parent, node) {
  if (_.isEmpty(node))
    return;
  Object.keys(node).forEach(key => {
    let query = ` MATCH (parent:ProductCategory)
                  where id(parent)=${parent.id}
                  CREATE (sub:ProductCategory{name:"${key}"})-[:CATEGORY]->(parent)
                  RETURN sub`;
    ProductCategory.query(query, function (err, sub) {
      console.log(sub);
      if (err) return console.log(err);
      createProductCategoriesNode(sub[0], node[key])
    });
  })
}



function createProductCategories(callback) {
  createProductCategoryRoot(function (err, root) {
    if (err) return callback(err);
    createProductCategoriesNode(root, EBayProductCategories, function (err) {
      if (err) return callback(err);
      return callback(null);
    })
  })
}

exports.reflect_products = function (req, res) {
  ProductCategory.query('match(n:ProductCategory) return n', function (err, categories) {
    categories.forEach(category => {
      Category.create({
        type: 'product',
        gid: category.id,
        name: category.name,
        isLeaf: false,
        translations: {en: category.name},
      }, function (err) {
        if (err) console.error(err);
      });
    })
  });
  return res.status(200).json('ok');
};

exports.update_product_leafs = function (req, res) {
  ProductCategory.query('MATCH (n:ProductCategory) WHERE NOT (n)<-[:CATEGORY]-(:ProductCategory) RETURN n',
    function (err, categories) {
      categories.forEach(g_category => {
        Category.findOne({ gid: g_category.id }, function (err, category) {
          if (err) console.log(err);
          if(category) {
            category.isLeaf = true;
            category.save();
            console.log(`update category ${category.name}`);
          }else {
            return console.log(`category is null ${JSON.stringify(g_category)}`);
          }
        });
      });
      return res.status(200).json('ok');
    })
};

exports.init_product = function (req, res) {
  createProductCategories(function (err) {
    if (err) return handleError(res, err);
    return res.status(200).json('ok');
  })
};

exports.reflect_businesses = function (req, res) {
  BusinessCategory.query('match(n:BusinessCategory) return n', function (err, categories) {
    categories.forEach(category => {
      Category.create({
        type: 'business',
        gid: category.id,
        name: category.name,
        isLeaf: false,
        translations: {en: category.name},
      }, function (err, category) {
        if (err) console.error(err);
        console.log(`insert category ${category.name}`);
      });
    })
  });
  return res.status(200).json('ok');
};

exports.update_business_leafs = function (req, res) {
  BusinessCategory.query('MATCH (n:BusinessCategory) WHERE NOT (n)<-[:CATEGORY]-(:BusinessCategory) RETURN n',
    function (err, categories) {
      categories.forEach(category => {
        Category.findOne({ gid: category.id }, function (err, category) {
          if (err) console.log(err);
          category.isLeaf = true;
          category.save();
          console.log(`update category ${category.name}`);
        });
      });
      return res.status(200).json('ok');
    })
};

exports.init_business = function (req, res){
  // BusinessCategory.model.setUniqueKey('name', true);
  // BusinessCategory.model.setUniqueKey('PayPalId', true);

  const businessCategories = require('./data/business.categories');
  BusinessCategory.query(`CREATE(:BusinessCategory{name:"BusinessRootCategory"})`,
    function (err) {
      if (err) return handleError(res, err);
      let top = {};
      businessCategories.forEach(category => {
        top[category.t.name] = category.t.PayPalId;
      });
      async.each(Object.keys(top), function (key, callback) {
        BusinessCategory.query(
          `MATCH (root:BusinessCategory{name:"BusinessRootCategory"}) 
           CREATE (root)<-[:CATEGORY]-(:BusinessCategory{name:"${key}", PayPalId:"${top[key]}"})`,callback)
      }, function (err) {
        if (err) return handleError(res, err);
        async.each(businessCategories, function (category, callback) {
          BusinessCategory.query(
            `MATCH (top:BusinessCategory{name:"${category.t.name}"}) 
           CREATE (top)<-[:CATEGORY]-(:BusinessCategory{name:"${category.c.name}", PayPalId:"${category.c.PayPalId}"})`,callback)
        })
      }, function(err){
        if (err) return handleError(res, err);
        return res.status(200).json('ok');
      });
    })
};

function add_product_categories(categories, parent, callback) {
  async.each(categories, function (name, callback) {
    ProductCategory.save({name: name}, function (err, category) {
      let query = `MATCH (top:ProductCategory{name:"${parent}"}), (sub:ProductCategory{name:"${category.name}"})
                        CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
      ProductCategory.query(query, function (err) {
        Category.create({
          type: 'product',
          gid: category.id,
          name: category.name,
          isLeaf: true,
          translations: {en: category.name},
        }, callback)
      })
    });
  }, callback)
}
function create_product_categories(req, res) {
  let parent = req.body.input.parent;
  let categories = req.body.input.categories;
  add_product_categories(categories, parent, function(err){
    if(err) return handleError(res, err);
    return res.status(200).json('ok');
  });
}

function add_object_categories(type, parent, node) {
  if (_.isEmpty(node))
    return;
  let typeName = type=== 'business'? 'BusinessCategory' : 'ProductCategory';
  let NeoModel = type=== 'business'? BusinessCategory : ProductCategory;
  Object.keys(node).forEach(key => {
    let query = ` MATCH (parent:${typeName})
                  where id(parent)=${parent.id}
                  CREATE (sub:${typeName}{name:"${key}"})-[:CATEGORY]->(parent)
                  RETURN sub`;
    NeoModel.query(query, function (err, sub) {
      console.log(sub);
      if (err) return console.log(err);
      Category.create({
        type: type,
        gid: sub.id,
        name: key,
        isLeaf: false,
        translations: {en: key},
      });
      add_object_categories(type, sub[0], node[key])
    });
  })
}


function add_categories(type, categories, parent) {

  categories.forEach(function (name) {
    let typeName = type=== 'business'? 'BusinessCategory' : 'ProductCategory';

    let query = ` MATCH (parent:${typeName})
                  where id(parent)=${parent.id}
                  CREATE (sub:${typeName}{name:"${name}"})-[:CATEGORY]->(parent)
                  RETURN sub`;
    ProductCategory.query(query, function (err, category) {
      if(err) return console.log(err);
    })
  })
}



function csv_load_product_categories(req, res) {
  let query = ` MATCH (parent:ProductCategory{name:"ProductRootCategory"})
                  CREATE (sub:ProductCategory{name:"Groceries"})-[:CATEGORY]->(parent)
                  RETURN sub`;

  ProductCategory.query(query, function (err, sub) {
    if(err) return handleError(res, err);
    const csv = require('csvtojson');
    let top = {};
    csv()
      .fromFile('/home/ubuntu/low.la/thiscounts/server/api/category/data/groceries.csv')
      //.fromFile('/Users/moshe/projects/low.la/thiscounts/server/api/category/data/groceries.csv')
      .on('json', (jsonObj) => {
        //console.log(Object.keys(jsonObj)  + '=>' + JSON.stringify(jsonObj));
        let obj = top;
        Object.keys(jsonObj).forEach(key => {
          function getValue(obj, key) {
            if(!obj[key])
              obj[key] = {};
            return obj[key];
          }
          obj = getValue(obj, jsonObj[key])
        });
      })
      .on('done', (error) => {
        add_object_categories('product', sub[0], top);
        return res.status(200).json('ok');
      });
  });
}

let fast_food_product_categories = function (req, res) {
  const fastFoodCategories = require('./data/wikipedia.fastfood');
  let query = ` MATCH (parent:ProductCategory{name:"ProductRootCategory"})
                  CREATE (sub:ProductCategory{name:"Fast Food"})-[:CATEGORY]->(parent)
                  RETURN sub`;

  ProductCategory.query(query, function (err, fastFood) {
    if(err) return handleError(res, err);
    add_categories('product', fastFoodCategories["Fast food"], fastFood[0]);
    return res.status(200).json('ok');
  });
};

function drop_uniqueness(req, res){
  function callback(err){
    if(err) console.log(err.message);
  }
  //DROP CONSTRAINT ON (n:\`${label}\`) ASSERT n.\`${key}\` IS UNIQUE
  ProductCategory.db().constraints.uniqueness.drop('ProductCategory', 'name', callback);
  BusinessCategory.db().constraints.uniqueness.drop('BusinessCategory', 'name', callback);
  BusinessCategory.db().constraints.uniqueness.drop('BusinessCategory', 'PayPalId', callback);
  return res.status(200).json('ok');
}

//https://cloud.google.com/translate/docs/languages
// Translate.translate(category.name, req.params.to, function(err, translation) {
//   if(err) console.log(err.message);
//   console.log(`${category.name} translation to ${req.params.to} is ${translation}`);
//   category.translations[req.params.to] = translation;
//   category.save();
// });
exports.translate = function (req, res) {

  const callTranslateApi = limit(function(category_name, callback) {
    Translate.translate(category_name, req.params.to, callback);
    //callback(null, req.params.to + '_' + category_name)
  }).to(20).per(1000);


  /*  Category.find({}).skip(0).limit(100)
      .exec ( (err, categories) => {
        categories.forEach(category => {
          callTranslateApi(category.name, function (err, translation) {
            if (err) return console.log(err.message);
            let translations = category.translations;
            console.log(Object.keys(translations));
            let newTranslations = {
            };
            Object.keys(translations).forEach(key => {
              newTranslations[key] = translations[key];
            });
            newTranslations[req.params.to] = translation;

            category.translations = newTranslations;
            category.save(function (err, category) {
              Category.findById(category._id).exec( (err, c) =>{
                console.log(c);
                });
              // if (err) return console.log(err.message);
              // console.log(`saving ${category.name} translation to ${req.params.to} is ${translation}`);
            });
          })
        });
      });*/


  const cursor = Category.find({}).cursor();
  cursor.eachAsync(category => {
    callTranslateApi(category.name, function(err, translation) {
      if (err) return console.log(err.message);
      let translations = category.translations;
      let newTranslations = {};
      Object.keys(translations).forEach(key => {
        newTranslations[key] = translations[key];
      });
      newTranslations[req.params.to] = translation;
      category.translations = newTranslations;

      category.save(function (err, category) {
        // Category.findById(category._id).exec( (err, c) =>{
        //   console.log(c);
        //   });
        if (err) return console.log(err.message);
        console.log(JSON.stringify(category.translations));
        //console.log(`saving ${category.name} translation to ${req.params.to} is ${translation}`);
      });
    });
  });

  return res.status(200).send(`translation to ${req.params.to} has started`);
};

exports.work = function (req, res) {
  switch(req.params.function){
    case 'update_product_leafs':
      return exports.update_product_leafs(req, res);
    case 'reflect_products':
      return exports.reflect_products(req, res);
    case 'update_business_leafs':
      return exports.update_business_leafs(req, res);
    case 'reflect_businesses':
      return exports.reflect_businesses(req, res);
    case 'init_business':
      return exports.init_business(req, res);
    case 'init_product':
      return exports.init_product(req, res);
    case 'create_product_categories':
      return create_product_categories(req, res);
    case 'csv_load_product_categories':
      return csv_load_product_categories(req, res);
    case 'fast_food_product_categories':
      return fast_food_product_categories(req, res);
    case 'drop_uniqueness':
      return drop_uniqueness(req, res);
    default:
      return res.status(404).json(`${req.params.function} not supported please refer to the code`);
  }
};

exports.business = function (req, res) {
  let parent = req.params.parent;
  let lang = req.params.lang || 'en';
  let query = parent === 'root' ?
    `match(n:BusinessCategory{name:"BusinessRootCategory"})<-[c:CATEGORY]-(m) return m` :
    `match(n:BusinessCategory)<-[c:CATEGORY]-(m) where id(n)=${parent} return m`;
  BusinessCategory.query(query, function (err, categories) {
    if (err) return handleError(res, err);
    let gids = [];
    categories.forEach(category => {
      gids.push(category.id)
    });
    Category.find({})
      .where('gid').in(gids)
      .select(`gid isLeaf translations.${lang} -_id`)
      .exec(function (err, categories) {
        return res.status(200).json(categories);
      })
  })
};

exports.product = function (req, res) {
  let parent = req.params.parent;
  let lang = req.params.lang || 'en';
  let query = parent === 'root' ?
    `match(n:ProductCategory{name:"ProductRootCategory"})<-[c:CATEGORY]-(m) return m` :
    `match(n:ProductCategory)<-[c:CATEGORY]-(m) where id(n)=${parent} return m`;
  ProductCategory.query(query, function (err, categories) {
    if (err) return handleError(res, err);
    let gids = [];
    categories.forEach(category => {
      gids.push(category.id)
    });
    Category.find({})
      .where('gid').in(gids)
      .select(`gid isLeaf translations.${lang} -_id`)
      .exec(function (err, categories) {
        return res.status(200).json(categories);
      })
  })
};

exports.categoryById = function (req, res) {
  Category.find({})
    .where('gid')
    .equals(req.params.id)
    .select(`gid isLeaf translations.${req.params.lang} -_id`)
    .exec(function (err, categories) {
      return res.status(200).json(categories);
    })
};

// Get list of categories
exports.index = function (req, res) {
  Category.find(function (err, categories) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, categories);
  });
};

// Get a single category
exports.show = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function (req, res) {
  Category.create(req.body, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(category, function (err) {
      if (err) {
        return handleError(res, err);
      }
    });
    return res.json(201, category);
  });
};

exports.add_product = function (req, res) {
  let parent = req.params.parent;
  let categories = req.body;
  categories.forEach(name => {
    ProductCategory.save({name: name}, function (err, category) {
      let query = `MATCH (top:ProductCategory{name:"${parent}"}), (sub:ProductCategory{name:"${category.name}"})
                                    CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
      ProductCategory.query(query, function (err) {
        Category.create({
          type: 'product',
          gid: category.id,
          name: category.name,
          isLeaf: true,
          translations: {en: category.name},
        })
      })
    })
  });
  ProductCategory.query(`MATCH (n:ProductCategory{name:'${parent}'}) RETURN n`,
    function (err, categories) {
      categories.forEach(category => {
        let conditions = {gid: category.gid};
        let update = {isLeaf: false};
        let options = {multi: false};
        Category.update(conditions, update, options);
      });
      return res.status(200).json('ok');
    });

  return res.status(201).send();
};

exports.add_business = function (req, res) {
  let parent = req.params.parent;
  let categories = req.body;
  categories.forEach(name => {
    BusinessCategory.save({name: name}, function (err, category) {
      let query = `MATCH (top:BusinessCategory{name:"${parent}"}), (sub:BusinessCategory{name:"${category.name}"})
                                    CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
      BusinessCategory.query(query, function (err) {
        Category.create({
          type: 'business',
          gid: category.id,
          name: category.name,
          isLeaf: true,
          translations: {en: category.name},
        })
      })
    })
  });
  BusinessCategory.query(`MATCH (n:BusinessCategory{name:'${parent}'}) RETURN n`,
    function (err, categories) {
      categories.forEach(category => {
        let conditions = {gid: category.gid};
        let update = {isLeaf: false};
        let options = {multi: false};
        Category.update(conditions, update, options);
      });
      return res.status(200).json('ok');
    });
  return res.status(201).send();
};


// Updates an existing category in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    let updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, category);
    });
  });
};

// Deletes a category from the DB.
exports.destroy = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    category.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}


