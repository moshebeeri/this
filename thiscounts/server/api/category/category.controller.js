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

function createProductCategoryRoot(callback) {
  ProductCategory.save({name: 'ProductRootCategory'}, callback)
}

let nodes = 0;
function createProductCategoriesNode(parentName, node, callback) {
  if (_.isEmpty(node))
    return callback(null);

  async.eachLimit(Object.keys(node), 2, function (key, callback) {
    ProductCategory.save({name: key}, function (err, category) {
      let query = `MATCH (top:ProductCategory{name:"${parentName}"}), (sub:ProductCategory{name:"${category.name}"})
                                  CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
      ProductCategory.query(query, function (err) {
        if (err) return callback(err);
        createProductCategoriesNode(key, node[key], callback);
      });
    })
  }, function (err) {
    if (err) return callback(err);
    ProductCategory.query('match(n:ProductCategory) return n', function (err, categories) {
      categories.forEach(category => {
        Category.create({
          type: 'product',
          gid: category.id,
          name: category.name,
          translations: {en: category.name},
        });
      })
    });
    return callback(null);
  })
}

function createProductCategories(callback) {
  //createProductTwoLevelsCategories(callback);
  ProductRootCategory.model.setUniqueKey('name', true);
  ProductCategory.model.setUniqueKey('name', true);

  createProductCategoryRoot(function (err, root) {
    if (err) return callback(err);
    createProductCategoriesNode('ProductRootCategory', EBayProductCategories, function (err) {
      if (err) return callback(err);
      return callback(null);
    })
  })
}

exports.reflect_products = function (req, res) {
  ProductCategory.query('match(n:ProductCategory) return n', function (err, categories) {
    categories.forEach(category => {
      console.log(`insert category ${category.name}`);
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

exports.init_product = function (req, res) {
  nodes = 0;
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
/*
 {
 "n": {
 "name": "BusinessRootCategory",
 "id": 795
 },
 "t": {
 "PayPalId": "1025",
 "name": "Vehicle service and accessories",
 "id": 821
 },
 "c": {
 "PayPalId": "2297",
 "name": "Accessories",
 "id": 875
 }
 },
 */
exports.init_business = function (req, res){
  BusinessCategory.model.setUniqueKey('name', true);
  BusinessCategory.model.setUniqueKey('PayPalId', true);
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
    console.log(gids);
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
    console.log(gids);
    Category.find({})
      .where('gid').in(gids)
      .select(`gid isLeaf translations.${lang} -_id`)
      .exec(function (err, categories) {
        return res.status(200).json(categories);
      })
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
        console.log(`update category ${category.name}`);
        let conditions = {gid: category.gid};
        let update = {isLeaf: false};
        let options = {multi: false};
        Category.update(conditions, update, options);
      });
      return res.status(200).json('ok');
    });

  return res.status(201);
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
        console.log(`update category ${category.name}`);
        let conditions = {gid: category.gid};
        let update = {isLeaf: false};
        let options = {multi: false};
        Category.update(conditions, update, options);
      });
      return res.status(200).json('ok');
    });

  return res.status(201);
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


