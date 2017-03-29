
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
class EntityUtils {


    transformJson(json) {
        return json.formData;
    }



    doUpload(imagePath, imageMime, userId, token, callbackFunction, errorCallBack, responseData) {
        let files = [
            {
                name: imagePath + '___' + responseData._id,
                filename: imagePath + '___' + responseData._id,
                filepath: imagePath,  // image from camera roll/assets library
                filetype: imageMime,
            }

        ];

        let opts = {
            url: `${server_host}/api/images/` + responseData._id,
            files: files,
            method: 'POST',                             // optional: POST or PUT
            headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
            params: {},                   // optional
        };

        RNUploader.upload(opts, (err, response) => {
            if (err) {
                console.log(err);
                errorCallBack(err);
                return;
            }

            callbackFunction(responseData);


        });
    }



    saveEntity(entityData, entityApi, json, token, callbackFunction, errorCallBack, userId) {
        fetch(`${server_host}/api/` + entityApi, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                },
                body: json

            }
        ).then((response) => response.json())
            .then((responseData) => {
                if (entityData.image) {
                    this.doUpload(entityData.image.uri, entityData.image.mime, userId, token, callbackFunction, errorCallBack, responseData);
                    return
                }
                callbackFunction(responseData);

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);

            errorCallBack(error);

        });

    }

     create(entityApi,entityData,token,callbackFunction,errorCallBack,userId){
         //let entity = transformJson(entityData);
         let json  = JSON.stringify(entityData);

         this.saveEntity(entityData,entityApi,json,token,callbackFunction,errorCallBack,userId);

     }
}


export default EntityUtils;


