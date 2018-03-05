import Timer from "./LogTimer";

let timer = new Timer();
import * as errors from './Errors'
class ImageApi {
    uploadImage(token,image,entityId) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData();

                if(image.path){
                    data.append('photo', {
                        uri: image.path,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }else {
                    data.append('photo', {
                        uri: image.uri,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }
                const response = await fetch(`${server_host}/api/images/` + entityId, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    },
                    body: data
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    uploadImageLogo(token,image,entityId) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData();

                if(image.path){
                    data.append('photo', {
                        uri: image.path,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }else {
                    data.append('photo', {
                        uri: image.uri,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }
                const response = await fetch(`${server_host}/api/images/logo/` + entityId, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    },
                    body: data
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    uploadImagletter(token,image,entityId) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData();

                if(image.path){
                    data.append('photo', {
                        uri: image.path,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }else {
                    data.append('photo', {
                        uri: image.uri,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }
                const response = await fetch(`${server_host}/api/images/letterOfIncorporation/` + entityId, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    },
                    body: data
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    uploadImagIdentificationCardr(token,image,entityId) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData();

                if(image.path){
                    data.append('photo', {
                        uri: image.path,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }else {
                    data.append('photo', {
                        uri: image.uri,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                    });
                }
                const response = await fetch(`${server_host}/api/images/identificationCard/` + entityId, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    },
                    body: data
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getQrCodeImage(qrCode, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/qrcodes/image/id/` + qrCode, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), '/api/qrcodes/', 'image/code/');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

}

const  imageApi = new ImageApi();
export default imageApi;