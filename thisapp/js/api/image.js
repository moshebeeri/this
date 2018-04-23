import serverRequestHandler from './serverRequestHandler';

class ImageApi {
    uploadImage(token, image, entityId) {
        const data = new FormData();
        if (image.path) {
            data.append('photo', {
                uri: image.path,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        } else {
            data.append('photo', {
                uri: image.uri,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        }
        return serverRequestHandler.fetch_handler(`${server_host}/api/images/${entityId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        }, 'images', '/upload');
    }

    uploadImageLogo(token, image, entityId) {
        const data = new FormData();
        if (image.path) {
            data.append('photo', {
                uri: image.path,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        } else {
            data.append('photo', {
                uri: image.uri,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        }
        return serverRequestHandler.fetch_handler(`${server_host}/api/images/logo/${entityId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        }, 'images', 'logo/upload');
    }

    uploadImagletter(token, image, entityId) {
        const data = new FormData();
        if (image.path) {
            data.append('photo', {
                uri: image.path,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        } else {
            data.append('photo', {
                uri: image.uri,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        }
        return serverRequestHandler.fetch_handler(`${server_host}/api/images/letterOfIncorporation/${entityId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        }, 'images', 'letterOfIncorporation/upload');
    }

    uploadImagIdentificationCardr(token, image, entityId) {
        const data = new FormData();
        if (image.path) {
            data.append('photo', {
                uri: image.path,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        } else {
            data.append('photo', {
                uri: image.uri,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName'
            });
        }
        return serverRequestHandler.fetch_handler(`${server_host}/api/images/identificationCard/${entityId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        }, 'images', 'identificationCard/upload');
    }

    getQrCodeImage(qrCode, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/qrcodes/image/id/${qrCode}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
        }, 'api/qrcodes', 'mage/code');
    }
}

const imageApi = new ImageApi();
export default imageApi;