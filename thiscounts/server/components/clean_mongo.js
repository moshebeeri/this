// let c = `
// var collectionNames = db.getCollectionNames();
// for(var i = 0, len = collectionNames.length; i < len ; i++){
//   var collectionName = collectionNames[i];
//   if(collectionName !== 'categories' &&
//     collectionName !== 'system.indexes'){
//     print(collectionName)
//   }
// }
// `;

let b = `
use lowla-dev;
var collectionNames = db.getCollectionNames();
for(var i = 0, len = collectionNames.length; i < len ; i++){
    var collectionName = collectionNames[i];
    if(collectionName !== 'categories' &&
        collectionName !== 'system.indexes'){
        db[collectionName].drop()
    }
}
`;

let a = `
match (u:user) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:product) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:activity) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:campaign) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:group) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:promotion) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:instance) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:business) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:location) optional match (u)-[r]-() delete u,r
WITH count(*) as dummy
match (u:barcode) optional match (u)-[r]-() delete u,r
`;

let clean =`db.feeds.remove({_id: {$gt:new ObjectId( Math.floor(new Date(new Date()-1000*60*60*6).getTime()/1000).toString(16) + "0000000000000000" )}})`;
