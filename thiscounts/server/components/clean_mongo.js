var collectionNames = db.getCollectionNames();
for(var i = 0, len = collectionNames.length; i < len ; i++){
  var collectionName = collectionNames[i];
  if(collectionName !== 'categories' &&
    collectionName !== 'system.indexes'){
    print(collectionName)
  }
}

var collectionNames = db.getCollectionNames();
for(var i = 0, len = collectionNames.length; i < len ; i++){
    var collectionName = collectionNames[i];
    if(collectionName !== 'categories' &&
        collectionName !== 'system.indexes'){
        db[collectionName].drop()
    }
}
let a = `
  match (u:user) optional match (u)-[r]-() delete u,r
  match (u:product) optional match (u)-[r]-() delete u,r
  match (u:activity) optional match (u)-[r]-() delete u,r
  match (u:campaign) optional match (u)-[r]-() delete u,r
  match (u:group) optional match (u)-[r]-() delete u,r
  match (u:promotion) optional match (u)-[r]-() delete u,r
  match (u:instance) optional match (u)-[r]-() delete u,r
  match (u:business) optional match (u)-[r]-() delete u,r
  match (u:location) optional match (u)-[r]-() delete u,r
  match (u:barcode) optional match (u)-[r]-() delete u,r
`;
