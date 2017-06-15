
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
const FILeUploader = NativeModules.FileUpload;
import store from 'react-native-simple-store';

class EntityUtils {


    transformJson(json) {
        return json.formData;
    }



    doUpload(imagePath, imageMime, token, callbackFunction, entityApi,responseData) {
        let files = [
            {
                name: imagePath + '___' + responseData._id,
                filename: imagePath + '___' + responseData._id,
                filepath: imagePath,  // image from camera roll/assets library
                filetype: imageMime,
            }

        ];

        let getEntity = this.getEntity.bind(this);

        if(RNUploader){
            let opts = {
                url: `${server_host}/api/images/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},                   // optional
            };
            RNUploader.upload(opts, (err, response) => {


                getEntity(entityApi,responseData._id,callbackFunction)


            });

        }else{
            let option2 = {
                uploadUrl: `${server_host}/api/images/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                fields:{}
                             // optional
            };
            FILeUploader.upload(option2, function(err, result) {

                getEntity(entityApi,responseData._id,callbackFunction)
            })
        }


    }



    getEntity(entityApi ,entityId,callbackFunction) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/${entityApi}/${entityId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                callbackFunction(responseData);
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


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
                    this.doUpload(entityData.image.uri, entityData.image.mime, token, callbackFunction, entityApi,responseData);
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

    updateEntity(entityData, entityApi, json, token, callbackFunction, errorCallBack, entityId) {
        fetch(`${server_host}/api/` + entityApi+'/'+ entityId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                },
                body: json

            }
        ).then((response) => response.json())
            .then((responseData) => {

                callbackFunction(responseData);

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ');

            errorCallBack(error);

        });

    }

    update(entityApi,entityData,token,callbackFunction,errorCallBack,entityId){
        //let entity = transformJson(entityData);
        let json  = JSON.stringify(entityData);

        this.updateEntity(entityData,entityApi,json,token,callbackFunction,errorCallBack,entityId);

    }
}


export default EntityUtils;


