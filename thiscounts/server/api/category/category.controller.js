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
const ProductCategories = require('./data/product.category');
const EBayProductCategories = require('./data/product.category.ebay');

let top = {
  "1000": "Arts, crafts, and collectibles",
  "1001": "Baby",
  "1002": "Beauty and fragrances",
  "1003": "Books and magazines",
  "1004": "Business to business",
  "1005": "Clothing, accessories, and shoes",
  "1006": "Computers, accessories, and services",
  "1007": "Education",
  "1008": "Electronics and telecom",
  "1009": "Entertainment and media",
  "1010": "Financial services and products",
  "1011": "Food retail and service",
  "1012": "Gifts and flowers",
  "1013": "Government",
  "1014": "Health and personal care",
  "1015": "Home and garden",
  "1016": "Nonprofit",
  "1017": "Pets and animals",
  "1018": "Religion and spirituality (for profit)",
  "1019": "Retail (not elsewhere classified)",
  "1020": "Services - other",
  "1021": "Sports and outdoors",
  "1022": "Toys and hobbies",
  "1023": "Travel",
  "1024": "Vehicle sales",
  "1025": "Vehicle service and accessories"
};
let sub = {
  "2000": ["Antiques", "1000"],
  "2001": ["Art and craft supplies", "1000"],
  "2002": ["Art dealers and galleries", "1000"],
  "2003": ["Camera and photographic supplies", "1000"],
  "2004": ["Digital art", "1000"],
  "2005": ["Memorabilia", "1000"],
  "2006": ["Music store (instruments and sheet music)", "1000"],
  "2007": ["Sewing, needlework, and fabrics", "1000"],
  "2008": ["Stamp and coin", "1000"],
  "2009": ["Stationary, printing and writing paper", "1000"],
  "2010": ["Vintage and collectibles", "1000"],
  "2011": ["Clothing", "1001"],
  "2012": ["Furniture", "1001"],
  "2013": ["Baby products (other)", "1001"],
  "2014": ["Safety and health", "1001"],
  "2015": ["Bath and body", "1002"],
  "2016": ["Fragrances and perfumes", "1002"],
  "2017": ["Makeup and cosmetics", "1002"],
  "2018": ["Audio books", "1003"],
  "2019": ["Digital content", "1003"],
  "2020": ["Educational and textbooks", "1003"],
  "2021": ["Fiction and nonfiction", "1003"],
  "2022": ["Magazines", "1003"],
  "2023": ["Publishing and printing", "1003"],
  "2024": ["Rare and used books", "1003"],
  "2025": ["Accounting", "1004"],
  "2026": ["Advertising", "1004"],
  "2027": ["Agricultural", "1004"],
  "2028": ["Architectural, engineering, and surveying services", "1004"],
  "2029": ["Chemicals and allied products", "1004"],
  "2030": ["Commercial photography, art, and graphics", "1004"],
  "2031": ["Construction", "1004"],
  "2032": ["Consulting services", "1004"],
  "2033": ["Educational services", "1004"],
  "2034": ["Equipment rentals and leasing services", "1004"],
  "2035": ["Equipment repair services", "1004"],
  "2036": ["Hiring services", "1004"],
  "2037": ["Industrial and manufacturing supplies", "1004"],
  "2038": ["Mailing lists", "1004"],
  "2039": ["Marketing", "1004"],
  "2040": ["Multi-level marketing", "1004"],
  "2041": ["Office and commercial furniture", "1004"],
  "2042": ["Office supplies and equipment", "1004"],
  "2043": ["Publishing and printing", "1004"],
  "2044": ["Quick copy and reproduction services", "1004"],
  "2045": ["Shipping and packing", "1004"],
  "2046": ["Stenographic and secretarial support services", "1004"],
  "2047": ["Wholesale", "1004"],
  "2048": ["Children's clothing", "1005"],
  "2049": ["Men's clothing", "1005"],
  "2050": ["Women's clothing", "1005"],
  "2051": ["Shoes", "1005"],
  "2052": ["Military and civil service uniforms", "1005"],
  "2053": ["Accessories", "1005"],
  "2054": ["Retail (fine jewelry and watches)", "1005"],
  "2055": ["Wholesale (precious stones and metals)", "1005"],
  "2056": ["Fashion jewelry", "1005"],
  "2057": ["Computer and data processing services", "1006"],
  "2058": ["Desktops, laptops, and notebooks", "1006"],
  "2059": ["Digital content", "1006"],
  "2060": ["eCommerce services", "1006"],
  "2061": ["Maintenance and repair services", "1006"],
  "2062": ["Monitors and projectors", "1006"],
  "2063": ["Networking", "1006"],
  "2064": ["Online gaming", "1006"],
  "2065": ["Parts and accessories", "1006"],
  "2066": ["Peripherals", "1006"],
  "2067": ["Software", "1006"],
  "2068": ["Training services", "1006"],
  "2069": ["Web hosting and design", "1006"],
  "2070": ["Business and secretarial schools", "1007"],
  "2071": ["Child daycare services", "1007"],
  "2072": ["Colleges and universities", "1007"],
  "2073": ["Dance halls, studios, and schools", "1007"],
  "2074": ["Elementary and secondary schools", "1007"],
  "2075": ["Vocational and trade schools", "1007"],
  "2076": ["Cameras, camcorders, and equipment", "1008"],
  "2078": ["Cell phones, PDAs, and pagers", "1008"],
  "2079": ["General electronic accessories", "1008"],
  "2080": ["Home audio", "1008"],
  "2081": ["Home electronics", "1008"],
  "2082": ["Security and surveillance", "1008"],
  "2083": ["Telecommunication equipment and sales", "1008"],
  "2084": ["Telecommunication services", "1008"],
  "2085": ["Telephone cards", "1008"],
  "2086": ["Memorabilia", "1009"],
  "2087": ["Movie tickets", "1009"],
  "2088": ["Movies (DVDs, videotapes)", "1009"],
  "2089": ["Music (CDs, cassettes and albums)", "1009"],
  "2090": ["Cable, satellite, and other pay TV and radio", "1009"],
  "2091": ["Adult digital content", "1009"],
  "2092": ["Concert tickets", "1009"],
  "2093": ["Theater tickets", "1009"],
  "2094": ["Toys and games", "1009"],
  "2095": ["Slot machines", "1009"],
  "2096": ["Digital content", "1009"],
  "2097": ["Entertainers", "1009"],
  "2098": ["Gambling", "1009"],
  "2099": ["Online games", "1009"],
  "2100": ["Video games and systems", "1009"],
  "2101": ["Accounting", "1010"],
  "2102": ["Collection agency", "1010"],
  "2103": ["Commodities and futures exchange", "1010"],
  "2104": ["Consumer credit reporting agencies", "1010"],
  "2105": ["Debt counseling service", "1010"],
  "2106": ["Credit union", "1010"],
  "2107": ["Currency dealer and currency exchange", "1010"],
  "2108": ["Escrow", "1010"],
  "2109": ["Finance company", "1010"],
  "2110": ["Financial and investment advice", "1010"],
  "2111": ["Insurance (auto and home)", "1010"],
  "2112": ["Insurance (life and annuity)", "1010"],
  "2113": ["Investments (general)", "1010"],
  "2114": ["Money service business", "1010"],
  "2115": ["Mortgage brokers or dealers", "1010"],
  "2116": ["Online gaming currency", "1010"],
  "2117": ["Paycheck lender or cash advance", "1010"],
  "2118": ["Prepaid and stored value cards", "1010"],
  "2119": ["Real estate agent", "1010"],
  "2120": ["Remittance", "1010"],
  "2121": ["Rental property management", "1010"],
  "2122": ["Security brokers and dealers", "1010"],
  "2123": ["Wire transfer and money order", "1010"],
  "2124": ["Alcoholic beverages", "1011"],
  "2125": ["Catering services", "1011"],
  "2126": ["Coffee and tea", "1011"],
  "2127": ["Gourmet foods", "1011"],
  "2128": ["Specialty and miscellaneous food stores", "1011"],
  "2129": ["Restaurant", "1011"],
  "2130": ["Tobacco", "1011"],
  "2131": ["Vitamins and supplements", "1011"],
  "2132": ["Florist", "1012"],
  "2133": ["Gift, card, novelty, and souvenir shops", "1012"],
  "2134": ["Gourmet foods", "1012"],
  "2135": ["Nursery plants and flowers", "1012"],
  "2136": ["Party supplies", "1012"],
  "2137": ["Government services (not elsewhere classified)", "1013"],
  "2138": ["Drugstore (excluding prescription drugs)", "1014"],
  "2139": ["Drugstore (including prescription drugs)", "1014"],
  "2140": ["Dental care", "1014"],
  "2141": ["Medical care", "1014"],
  "2142": ["Medical equipment and supplies", "1014"],
  "2143": ["Vision care", "1014"],
  "2144": ["Vitamins and supplements", "1014"],
  "2145": ["Antiques", "1015"],
  "2146": ["Appliances", "1015"],
  "2147": ["Art dealers and galleries", "1015"],
  "2148": ["Bed and bath", "1015"],
  "2149": ["Construction material", "1015"],
  "2150": ["Drapery, window covering, and upholstery", "1015"],
  "2151": ["Exterminating and disinfecting services", "1015"],
  "2152": ["Fireplace, and fireplace screens", "1015"],
  "2153": ["Furniture", "1015"],
  "2154": ["Garden supplies", "1015"],
  "2155": ["Glass, paint, and wallpaper", "1015"],
  "2156": ["Hardware and tools", "1015"],
  "2157": ["Home decor", "1015"],
  "2158": ["Housewares", "1015"],
  "2159": ["Kitchenware", "1015"],
  "2160": ["Landscaping", "1015"],
  "2161": ["Rugs and carpets", "1015"],
  "2162": ["Security and surveillance equipment", "1015"],
  "2163": ["Swimming pools and spas", "1015"],
  "2164": ["Charity", "1016"],
  "2165": ["Political", "1016"],
  "2166": ["Religious", "1016"],
  "2167": ["Other", "1016"],
  "2168": ["Personal", "1016"],
  "2169": ["Educational", "1016"],
  "2171": ["Medication and supplements", "1017"],
  "2172": ["Pet shops, pet food, and supplies", "1017"],
  "2173": ["Specialty or rare pets", "1017"],
  "2174": ["Veterinary services", "1017"],
  "2175": ["Membership services", "1018"],
  "2176": ["Merchandise", "1018"],
  "2177": ["Services (not elsewhere classified)", "1018"],
  "2178": ["Chemicals and allied products", "1019"],
  "2179": ["Department store", "1019"],
  "2180": ["Discount store", "1019"],
  "2181": ["Durable goods", "1019"],
  "2182": ["Non-durable goods", "1019"],
  "2183": ["Used and secondhand store", "1019"],
  "2184": ["Variety store", "1019"],
  "2185": ["Advertising", "1020"],
  "2186": ["Shopping services and buying clubs", "1020"],
  "2187": ["Career services", "1020"],
  "2188": ["Carpentry", "1020"],
  "2189": ["Child care services", "1020"],
  "2190": ["Cleaning and maintenance", "1020"],
  "2191": ["Commercial photography", "1020"],
  "2192": ["Computer and data processing services", "1020"],
  "2193": ["Computer network services", "1020"],
  "2194": ["Consulting services", "1020"],
  "2195": ["Counseling services", "1020"],
  "2196": ["Courier services", "1020"],
  "2197": ["Dental care", "1020"],
  "2198": ["eCommerce services", "1020"],
  "2199": ["Electrical and small appliance repair", "1020"],
  "2200": ["Entertainment", "1020"],
  "2201": ["Equipment rental and leasing services", "1020"],
  "2202": ["Event and wedding planning", "1020"],
  "2203": ["Gambling", "1020"],
  "2204": ["General contractors", "1020"],
  "2205": ["Graphic and commercial design", "1020"],
  "2206": ["Health and beauty spas", "1020"],
  "2207": ["IDs, licenses, and passports", "1020"],
  "2208": ["Importing and exporting", "1020"],
  "2209": ["Information retrieval services", "1020"],
  "2210": ["Insurance - auto and home", "1020"],
  "2211": ["Insurance - life and annuity", "1020"],
  "2212": ["Landscaping and horticultural", "1020"],
  "2213": ["Legal services and attorneys", "1020"],
  "2214": ["Local delivery service", "1020"],
  "2215": ["Lottery and contests", "1020"],
  "2216": ["Medical care", "1020"],
  "2217": ["Membership clubs and organizations", "1020"],
  "2218": ["Misc. publishing and printing", "1020"],
  "2219": ["Moving and storage", "1020"],
  "2220": ["Online dating", "1020"],
  "2221": ["Photofinishing", "1020"],
  "2222": ["Photographic studios - portraits", "1020"],
  "2223": ["Protective and security services", "1020"],
  "2224": ["Quick copy and reproduction services", "1020"],
  "2225": ["Radio, television, and stereo repair", "1020"],
  "2226": ["Real estate agent", "1020"],
  "2227": ["Rental property management", "1020"],
  "2228": ["Reupholstery and furniture repair", "1020"],
  "2229": ["Services (not elsewhere classified)", "1020"],
  "2230": ["Shipping and packing", "1020"],
  "2231": ["Swimming pool services", "1020"],
  "2232": ["Tailors and alterations", "1020"],
  "2233": ["Telecommunication service", "1020"],
  "2234": ["Utilities", "1020"],
  "2235": ["Vision care", "1020"],
  "2236": ["Watch, clock, and jewelry repair", "1020"],
  "2237": ["Athletic shoes", "1021"],
  "2238": ["Bicycle shop, service, and repair", "1021"],
  "2239": ["Boating, sailing and accessories", "1021"],
  "2240": ["Camping and outdoors", "1021"],
  "2241": ["Dance halls, studios, and schools", "1021"],
  "2242": ["Exercise and fitness", "1021"],
  "2243": ["Fan gear and memorabilia", "1021"],
  "2244": ["Firearm accessories", "1021"],
  "2245": ["Firearms", "1021"],
  "2246": ["Hunting", "1021"],
  "2247": ["Knives", "1021"],
  "2248": ["Martial arts weapons", "1021"],
  "2249": ["Sport games and toys", "1021"],
  "2250": ["Sporting equipment", "1021"],
  "2251": ["Swimming pools and spas", "1021"],
  "2252": ["Arts and crafts", "1022"],
  "2253": ["Camera and photographic supplies", "1022"],
  "2254": ["Hobby, toy, and game shops", "1022"],
  "2255": ["Memorabilia", "1022"],
  "2256": ["Music store - instruments and sheet music", "1022"],
  "2257": ["Stamp and coin", "1022"],
  "2258": ["Stationary, printing, and writing paper", "1022"],
  "2259": ["Vintage and collectibles", "1022"],
  "2260": ["Video games and systems", "1022"],
  "2261": ["Airline", "1023"],
  "2262": ["Auto rental", "1023"],
  "2263": ["Bus line", "1023"],
  "2264": ["Cruises", "1023"],
  "2265": ["Lodging and accommodations", "1023"],
  "2266": ["Luggage and leather goods", "1023"],
  "2267": ["Recreational services", "1023"],
  "2268": ["Sporting and recreation camps", "1023"],
  "2269": ["Taxicabs and limousines", "1023"],
  "2270": ["Timeshares", "1023"],
  "2271": ["Tours", "1023"],
  "2272": ["Trailer parks or campgrounds", "1023"],
  "2273": ["Transportation services - other", "1023"],
  "2274": ["Travel agency", "1023"],
  "2275": ["Auto dealer - new and used", "1024"],
  "2276": ["Auto dealer - used only", "1024"],
  "2277": ["Aviation", "1024"],
  "2278": ["Boat dealer", "1024"],
  "2279": ["Mobile home dealer", "1024"],
  "2280": ["Motorcycle dealer", "1024"],
  "2281": ["Recreational and utility trailer dealer", "1024"],
  "2282": ["Recreational vehicle dealer", "1024"],
  "2283": ["Vintage and collectibles", "1024"],
  "2284": ["New parts and supplies - motor vehicle", "1025"],
  "2285": ["Used parts - motor vehicle", "1025"],
  "2286": ["Audio and video", "1025"],
  "2287": ["Auto body repair and paint", "1025"],
  "2288": ["Auto rental", "1025"],
  "2289": ["Auto service", "1025"],
  "2290": ["Automotive tire supply and service", "1025"],
  "2291": ["Boat rental and leases", "1025"],
  "2292": ["Car wash", "1025"],
  "2293": ["Motor home and recreational vehicle rental", "1025"],
  "2294": ["Tools and equipment", "1025"],
  "2295": ["Towing service", "1025"],
  "2296": ["Truck and utility trailer rental", "1025"],
  "2297": ["Accessories", "1025"]
};


// Get list of categories
function createBusinessCategoryRoot(callback) {
  BusinessRootCategory.save({name: 'BusinessRootCategory'}, callback)
}

function createBusinessTopCategory(code, category, root, callback) {
  BusinessTopCategory.save({name: category, PayPalId: code}, function (err, category) {
    let query = `MATCH (top:BusinessTopCategory), (root:BusinessRootCategory{name:"BusinessRootCategory"}) 
                      WHERE id(top)=${category.id} CREATE UNIQUE (top)-[:CATEGORY]->(root)`;
    BusinessCategory.query(query, function(err){
      if(err) return callback(err);
      return callback(null)
    })
  })
}

function createBusinessSubCategory(code, subCategory, callback) {
  BusinessCategory.save({name: subCategory[0], PayPalId: code}, function (err, category) {
    let query = `MATCH (top:BusinessTopCategory{PayPalId:"${subCategory[1]}"}), (cat:BusinessCategory) 
                            WHERE id(cat)=${category.id} CREATE UNIQUE (cat)-[:CATEGORY]->(top)`;
    BusinessCategory.query(query, callback)
  })
}

function createBusinessCategories(callback) {
  BusinessRootCategory.model.setUniqueKey('name', true);
  BusinessTopCategory.model.setUniqueKey('PayPalId', true);
  BusinessTopCategory.model.setUniqueKey('name', true);
  BusinessCategory.model.setUniqueKey('name', true);

  createBusinessCategoryRoot(function (err, root) {
    async.each(Object.keys(top), function (key, callback) {
      createBusinessTopCategory(key, top[key], root, callback);
    }, function (err) {
      if (err) return callback(err);
      async.each(Object.keys(sub), function (key, callback) {
        createBusinessSubCategory(key, sub[key], callback);
      }, function (err) {
        if (err) return callback(err);
        callback(null)
      });
    });
  });
}

function createProductCategoryRoot(callback) {
  ProductCategory.save({name: 'ProductRootCategory'}, callback)
}

/*
 function createProductCategoryRoot(callback) {
 ProductRootCategory.save({name: 'ProductRootCategory'}, callback)
 }
function createSubCategory(subCategoryName, topCategoryName, callback) {
  ProductCategory.save({name: subCategoryName}, function (err, category) {
    if(!category)
      return callback(null);
    let query = `MATCH (top:ProductTopCategory{name:"${topCategoryName}"}), (sub:ProductCategory)
                                WHERE id(sub)=${category.id} CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
    ProductCategory.query(query, function (err) {
      if (err) callback(err);
      return callback(null)
    });
  });
}
function createProductTopCategories(categoryName, callback) {
  ProductTopCategory.save({name: categoryName}, function (err, category) {
    let query = `MATCH (top:ProductTopCategory), (root:ProductRootCategory{name:"ProductRootCategory"})
                  WHERE id(top)=${category.id} CREATE UNIQUE (top)-[:CATEGORY]->(root)`;
    ProductCategory.query(query, function (err) {
      if (err) return callback(err);
      async.each(ProductCategories[categoryName], function (subCategoryName, callback) {
        createSubCategory(subCategoryName, categoryName, callback);
      }, callback);
    })
  })
}
function createProductTwoLevelsCategories(callback) {
  ProductRootCategory.model.setUniqueKey('name', true);
  ProductTopCategory.model.setUniqueKey('name', true);
  ProductCategory.model.setUniqueKey('name', true);

  createProductCategoryRoot(function (err) {
    if (err) return console.error(err);
    async.each(Object.keys(ProductCategories), function (categoryName, callback) {
      createProductTopCategories(categoryName, callback);
    }, function (err) {
      if (err) callback(err);
      console.log('Product Categories created successfully');
      return callback(null);
    }, callback);
  });
}
*/

function createProductCategoriesNode(parent, node, callback) {
  if(_.isEmpty(node))
    return callback(null);

  async.eachLimit(Object.keys(node), 2, function(key, callback) {
    ProductCategory.save({name: key}, function (err, category) {
      let query = `MATCH (top:ProductCategory{name:"${parent.name}"}), (sub:ProductCategory{name:"${category.name}"})
                                  CREATE UNIQUE (sub)-[:CATEGORY]->(top)`;
      ProductCategory.query(query, function (err) {
        if(err) return callback(err);
        Category.create({
          type: 'product',
          gid: category.id,
          name: key,
          translations: {en: key},
          isLeaf: _.isEmpty(node[key])
        });
        createProductCategoriesNode(node, node[key], callback);
      });
    })
  }, function(err){
    if(err) return callback(err);
    return callback(null);
  })
}

function createProductCategories(callback) {
  //createProductTwoLevelsCategories(callback);
  ProductRootCategory.model.setUniqueKey('name', true);
  ProductCategory.model.setUniqueKey('name', true);

  createProductCategoryRoot(function (err, root){
    if (err) return callback(err);
    createProductCategoriesNode(root, EBayProductCategories, function (err) {
      if (err) return callback(err);
      return callback(null);
    })
  })
}

function initializeGraphCategories(callback){
  createProductCategories(function (err){
    if (err) return callback(err);
    return callback(null);
    // createBusinessCategories(function (err) {
    //   if (err) return callback(err);
    //   return callback(null);
    // });
  })
}

initializeGraphCategories();

exports.work = function (req, res) {
  initializeGraphCategories(function (err){
    if (err) return handleError(res, err);
      return res.status(200).json('ok');
  })
};

exports.product = function (req, res) {
  return res.status(200).json(ProductCategories);
};

exports.business = function (req, res) {
  let query = `MATCH (b:BusinessRootCategory)-[:CATEGORY]-(t:BusinessTopCategory)<-[:CATEGORY]-(c:BusinessCategory) return t,c`;
  ProductCategory.query(query, function (err, categories) {
    if (err) return handleError(res, err);
    return res.status(200).json(categories);
  })
};

exports.create_business = function (req, res) {
  createBusinessCategories(function (err) {
    if (err) return handleError(res, err);
    return res.status(200);
  });
};

exports.top_business = function (req, res) {
  return res.status(200).json(top);
};

exports.sub_business = function (req, res) {
  return res.status(200).json(sub);
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


