const React = require('react-native');
const { Platform,} = React;
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
const FILeUploader = NativeModules.FileUpload;
import Upload from 'react-native-background-upload'
import store from 'react-native-simple-store';

class EntityUtils {
    transformJson(json) {
        return json.formData;
    }

    doUpload(imagePath, imageMime, token, callbackFunction, entityApi, responseData,imageApi) {
        let files = [
            {
                name: imagePath + '___' + responseData._id,
                filename: imagePath + '___' + responseData._id,
                filepath: imagePath,  // image from camera roll/assets library
                filetype: imageMime,
            }
        ];

        let uri = `${server_host}/api/images/` + responseData._id;
        if(imageApi){
             uri = `${server_host}/api/images/`+ imageApi + '/' + responseData._id;
        }

        let getEntity = this.getEntity.bind(this);
        if (Platform.OS === 'ios') {
            let opts = {
                url: uri,
                path: 'file:' + imagePath,
                method: 'POST',
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},
                field: 'uploaded_media',
                type: 'multipart'// optional
            };
            Upload.startUpload(opts).then((uploadId)=>{
                Upload.addListener('error', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
                Upload.addListener('completed', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
            }).catch((err) =>{
                getEntity(entityApi, responseData._id, callbackFunction)
            })

            ;
        } else {
            let option2 = {
                uploadUrl: uri,
                files: files,
                method: 'POST',
                type: 'raw',// optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                fields: {}
                // optional
            };
            FILeUploader.upload(option2, function (err, result) {
                getEntity(entityApi, responseData._id, callbackFunction)
            })
        }
    }

    doVideoUpload(path, imageMime, token, callbackFunction, entityApi, responseData) {
        let files = [
            {
                name: path + '___' + responseData._id,
                filename: path + '___' + responseData._id,
                filepath: path,  // image from camera roll/assets library
                filetype: imageMime,
            }
        ];
        let getEntity = this.getEntity.bind(this);
        if (Platform.OS === 'ios') {
            let opts = {
                url: `${server_host}/api/videos/` + responseData._id,
                path: 'file:' + path,
                method: 'POST',
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},
                field: 'uploaded_media',
                type: 'multipart'// optional
            };
            Upload.startUpload(opts).then((uploadId)=>{
                Upload.addListener('error', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
                Upload.addListener('completed', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
            }).catch((err) =>{
                getEntity(entityApi, responseData._id, callbackFunction)
            })

            ;
        } else {
            let option2 = {
                uploadUrl: `${server_host}/api/videos/` + responseData._id,
                files: files,
                method: 'POST',
                type: 'raw',// optional: POST or PUT
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
        if (Platform.OS === 'ios') {
            let opts = {
                url: `${server_host}/api/images/logo/` + responseData._id,
                path: 'file:' + imagePath,
                method: 'POST',                             // optional: POST or PUT
                headers: {'Accept': 'application/json', 'Authorization': 'Bearer ' + token},  // optional
                params: {},
                field: 'uploaded_media',
                type: 'multipart'// optional
            };
            Upload.startUpload(opts).then((uploadId)=>{
                Upload.addListener('error', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
                Upload.addListener('completed', uploadId, (data) => {
                    getEntity(entityApi, responseData._id, callbackFunction)
                })
            }).catch((err) =>{
                getEntity(entityApi, responseData._id, callbackFunction)
            })
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

                    if (entityData.IdIdentifierImage && entityData.IdIdentifierImage.path && entityData.IdIdentifierImage.mime) {
                        this.doUpload(entityData.IdIdentifierImage.path, entityData.IdIdentifierImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'identificationCard');
                    }

                    if (entityData.LetterOfIncorporationImage && entityData.LetterOfIncorporationImage.path && entityData.LetterOfIncorporationImage.mime) {
                        this.doUpload(entityData.LetterOfIncorporationImage.path, entityData.LetterOfIncorporationImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'letterOfIncorporation');
                    }

                    if (entityData.IdIdentifierImage && entityData.IdIdentifierImage.uri && entityData.IdIdentifierImage.mime) {
                        this.doUpload(entityData.IdIdentifierImage.uri, entityData.IdIdentifierImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'identificationCard');
                    }

                    if (entityData.LetterOfIncorporationImage && entityData.LetterOfIncorporationImage.uri && entityData.LetterOfIncorporationImage.mime) {
                        this.doUpload(entityData.LetterOfIncorporationImage.uri, entityData.LetterOfIncorporationImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'letterOfIncorporation');
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

                    if (entityData.IdIdentifierImage && entityData.IdIdentifierImage.path && entityData.IdIdentifierImage.mime) {
                        this.doUpload(entityData.IdIdentifierImage.path, entityData.IdIdentifierImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'identificationCard');
                    }

                    if (entityData.LetterOfIncorporationImage && entityData.LetterOfIncorporationImage.path && entityData.LetterOfIncorporationImage.mime) {
                        this.doUpload(entityData.LetterOfIncorporationImage.path, entityData.LetterOfIncorporationImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'letterOfIncorporation');
                    }

                    if (entityData.IdIdentifierImage && entityData.IdIdentifierImage.uri && entityData.IdIdentifierImage.mime) {
                        this.doUpload(entityData.IdIdentifierImage.uri, entityData.IdIdentifierImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'identificationCard');
                    }

                    if (entityData.LetterOfIncorporationImage && entityData.LetterOfIncorporationImage.uri && entityData.LetterOfIncorporationImage.mime) {
                        this.doUpload(entityData.LetterOfIncorporationImage.uri, entityData.LetterOfIncorporationImage.mime, token,  this.doLogg.bind(this), entityApi, responseData,'letterOfIncorporation');
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


