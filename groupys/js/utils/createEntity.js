const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
const FILeUploader = NativeModules.FileUpload;
import store from 'react-native-simple-store';

class EntityUtils {
    transformJson(json) {
        return json.formData;
    }

    doUpload(imagePath, imageMime, token, callbackFunction, entityApi, responseData) {
        let files = [
            {
                name: imagePath + '___' + responseData._id,
                filename: imagePath + '___' + responseData._id,
                filepath: imagePath,  // image from camera roll/assets library
                filetype: imageMime,
            }
        ];
        let getEntity = this.getEntity.bind(this);
        if (RNUploader) {
            let opts = {
                url: `${server_host}/api/images/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},                   // optional
            };
            RNUploader.upload(opts, (err, response) => {
                getEntity(entityApi, responseData._id, callbackFunction)
            });
        } else {
            let option2 = {
                uploadUrl: `${server_host}/api/images/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                fields: {}
                // optional
            };
            FILeUploader.upload(option2, function (err, result) {
                getEntity(entityApi, responseData._id, callbackFunction)
            })
        }
    }

    doLogoUpload(imagePath, imageMime, token, callbackFunction, entityApi, responseData) {
        let files = [
            {
                name: imagePath + '___' + responseData._id,
                filename: imagePath + '___' + responseData._id,
                filepath: imagePath,  // image from camera roll/assets library
                filetype: imageMime,
            }
        ];
        let getEntity = this.getEntity.bind(this);
        if (RNUploader) {
            let opts = {
                url: `${server_host}/api/images/logo/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},                   // optional
            };
            RNUploader.upload(opts, (err, response) => {
                getEntity(entityApi, responseData._id, callbackFunction)
            });
        } else {
            let option2 = {
                uploadUrl: `${server_host}/api/images/logo/` + responseData._id,
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                fields: {}
                // optional
            };
            FILeUploader.upload(option2, function (err, result) {
                getEntity(entityApi, responseData._id, callbackFunction)
            })
        }
    }

    getEntity(entityApi, entityId, callbackFunction) {
        return new Promise(async (resolve, reject) => {
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
                if (response.status ==='401') {
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


    create(entityApi, entityData, token, callbackFunction, errorCallBack, userId) {
        //let entity = transformJson(entityData);
        let json = JSON.stringify(entityData);
        return this.updateEntity(entityData, entityApi, json, token);
    }

    doLogg(){

    }

    updateEntity(entityData, entityApi, json, token) {
        return new Promise(async (resolve, reject) => {
            try {

                if (entityData && entityData._id) {
                    const response = await fetch(`${server_host}/api/` + entityApi + '/' + entityData._id, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + token,
                        },
                        body: json
                    });
                    if (response.status === 401) {
                        reject(response);
                        return;
                    }
                    if (response.status === 500) {
                        reject(response);
                        return;
                    }
                    let responseData = await response.json();

                    if (entityData.logoImage) {
                        this.doLogoUpload(entityData.logoImage.uri, entityData.logoImage.mime, token, this.doLogg.bind(this), entityApi, responseData);
                    }

                    if (entityData.image && entityData.image.uri && entityData.image.mime) {
                        this.doUpload(entityData.image.uri, entityData.image.mime, token, this.doLogg.bind(this), entityApi, responseData);
                    }

                    if (entityData.image && entityData.image.path && entityData.image.mime) {
                        this.doUpload(entityData.image.path, entityData.image.mime, token,  this.doLogg.bind(this), entityApi, responseData);
                    }

                    resolve(responseData);

                } else {
                    const response = await fetch(`${server_host}/api/` + entityApi + '/', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + token,
                        },
                        body: json
                    });
                    if (response.status === 401) {
                        reject(response);
                        return;
                    }
                    if (response.status === 500) {
                        reject(response);
                        return;
                    }


                    let responseData = await response.json();

                    if (entityData.logoImage) {
                        this.doLogoUpload(entityData.logoImage.uri, entityData.logoImage.mime, token, this.doLogg.bind(this), entityApi, responseData);
                    }

                    if (entityData.image && entityData.image.uri && entityData.image.mime) {
                        this.doUpload(entityData.image.uri, entityData.image.mime, token,  this.doLogg.bind(this), entityApi, responseData);
                    }
                    if (entityData.image && entityData.image.path && entityData.image.mime) {
                        this.doUpload(entityData.image.path, entityData.image.mime, token,  this.doLogg.bind(this), entityApi, responseData);
                    }

                    resolve(responseData);

                }
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    update(entityApi, entityData, token, callbackFunction, errorCallBack, entityId) {
        //let entity = transformJson(entityData);
        let json = JSON.stringify(entityData);
        return this.updateEntity(entityData, entityApi, json, token);
    }
}

export default EntityUtils;


