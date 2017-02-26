
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;

function transformJson(json){
  return json.formData;
}

function doUpload(json,imagePath,imageMime,userId,token,callbackFunction,errorCallBack,entityApi) {
    let files = [
        {
            name: "myimange",
            filename: 'image1.png',
            filepath:imagePath,  // image from camera roll/assets library
            filetype: imageMime,
        }

    ];

    let opts = {
        url: 'http://low.la:9000/api/images/' + userId,
        files: files,
        method: 'POST',                             // optional: POST or PUT
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + token },  // optional
        params: { },                   // optional
    };

    RNUploader.upload( opts, (err, response) => {
        if( err ){
            console.log(err);
            return;
        }

        saveEntity(entityApi,json,token,callbackFunction,errorCallBack);



    });
}

 function saveEntity(entityApi,json,token,callbackFunction,errorCallBack) {
     fetch('http://low.la:9000/api/' + entityApi, {
             method: 'POST',
             headers: {
                 'Accept': 'application/json, text/plain, */*',
                 'Content-Type': 'application/json;charset=utf-8',
                 'Authorization': 'Bearer ' + token,
             },
             body:  json

         }

     ).then((response) => response.json())
         .then((responseData) => {
             callbackFunction(responseData);

         }).catch(function (error) {

         console.log('There has been a problem with your fetch operation: ' + error.message);

         errorCallBack(error);

     });

 }


module.exports = function(entityApi,entityData,token,callbackFunction,errorCallBack,userId) {

    let entity = transformJson(entityData);
    let json  = JSON.stringify(entity);
    if(entityData.image){
        doUpload(json,entityData.image.uri,entityData.image.mime,userId,token,callbackFunction,errorCallBack,entityApi);
        return
    }
    saveEntity(entityApi,json,token,callbackFunction,errorCallBack);

}

