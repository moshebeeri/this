
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
var GLOBAL = require('../conf/global');
function transformJson(json){
  return json.formData;
}

function doUpload(imagePath,imageMime,userId,token,callbackFunction,errorCallBack,responseData) {
    let files = [
        {
            name: imagePath + '___' +responseData._id ,
            filename: imagePath + '___' +responseData._id ,
            filepath:imagePath,  // image from camera roll/assets library
            filetype: imageMime,
        }

    ];

    let opts = {
        url: GLOBAL.server_host +'/api/images/' + responseData._id,
        files: files,
        method: 'POST',                             // optional: POST or PUT
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + token },  // optional
        params: { },                   // optional
    };

    RNUploader.upload( opts, (err, response) => {
        if( err ){
            console.log(err);
            errorCallBack(err);
            return;
        }

        callbackFunction(responseData);


    });
}

 function saveEntity(entityData,entityApi,json,token,callbackFunction,errorCallBack,userId) {
     fetch(GLOBAL.server_host +'/api/' + entityApi, {
             method: 'POST',
             headers: {
                 'Accept': 'application/json, text/plain, */*',
                 'Content-Type': 'application/json;charset=utf-8',
                 'Authorization': 'Bearer ' + token,
             },
             body:  json

         }

     ).then((

         response) => response.json())
         .then((responseData) => {
             if(entityData.image){
                 doUpload(entityData.image.uri,entityData.image.mime,userId,token,callbackFunction,errorCallBack,responseData);
                 return
             }
             callbackFunction(responseData);

         }).catch(function (error) {

         console.log('There has been a problem with your fetch operation: ' + error.message);

         errorCallBack(error);

     });

 }


module.exports = function(entityApi,entityData,token,callbackFunction,errorCallBack,userId) {

    //let entity = transformJson(entityData);
    let json  = JSON.stringify(entityData);

    saveEntity(entityData,entityApi,json,token,callbackFunction,errorCallBack,userId);

}

