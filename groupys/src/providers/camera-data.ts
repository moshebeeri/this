import { Injectable, ViewChild, NgZone } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Headers } from '@angular/http';
import { Camera, Transfer, File } from 'ionic-native';

import { HeaderData } from './header-data';
import { UrlData } from './url-data';
import { UserData } from './user-data';
import { DeviceData } from './device-data';

@Injectable()
export class CameraData {
  @ViewChild(NavController) nav;

  local: any;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});

  cameraDestinationType: any;
  public base64Image: string;
  public imageLocalStorage: string;

  uploading: boolean = true;
  current: number = 1;
  total: number;
  progress: number;
  refreshPage: any;
  entityId: any;
  serviceName: string;

  constructor(private storage: Storage, private platform: Platform, private globalHeaders:HeaderData, private deviceService: DeviceData, private globals: UrlData, private ngZone: NgZone) {
    this.serviceName = "CameraData ======";
    //this.nav = nav;
    this.globals = globals;
    this.globalHeaders = globalHeaders;

    //this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    this.storage.get('token').then(token => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      console.log("CameraData ====== " + "token: " + JSON.stringify(this.contentHeader));
    }).catch(error => {
      console.log(error);
    });
    console.log("CameraData ====== " + "contentHeader:" + JSON.stringify(this.contentHeader));

    this.cameraDestinationType = this.deviceService.getCameraDestinationType();

    this.base64Image =  'img/avatar3.png';
    this.getBase64Image();

  }


  upload = (image: string, id: string) : void => {
    console.log("CameraData ====== " + "image: " + image);
    console.log("CameraData ====== " + "id: " + id);
    console.log("CameraData ====== " + "contentHeader: "+ JSON.stringify(this.contentHeader));

    this.deviceService.getLocalFileSystemURL(image);
    setTimeout(() => {
      let filePath = window.localStorage.getItem('filePath');
      setTimeout(() => {
        console.log("CameraData ====== " + "filePath: " + filePath);

        //this.base64Image2 = filePath;
        let fileURL = filePath;
        console.log("CameraData ====== " +  "filePath: " + filePath);


        let ft = new Transfer();
        //console.log(ft);
        let filename = fileURL.substr(fileURL.lastIndexOf('/') + 1).toString();
        console.log("CameraData ====== " + "filename: " + filename);
        if(filename === '.Pic.jpg' || filename === undefined){
          filename = this.deviceService.unixName();
        }

        let options = new FileUploadOptions();
        options.fileKey ='avatar';
        options.fileName = id + '--' + filename;
        console.log("CameraData ====== " + "filename: " + options.fileName);
        options.mimeType='image/jpeg';
        options.chunkedMode=false;


        let params = new Object();
        params['id'] = id;
        params['fileName'] = filename;
        params['key'] = filename;
        params['AWSAccessKeyId'] = 'AWSAccessKeyId';
        params['acl'] = "private";
        params['policy'] = 'policy';
        params['signature'] = 'signature';
        params['Content-Type'] = "image/jpeg";
        options.params = params;

        let headers = new Object();
        headers['Connection'] = 'close';
        console.log("CameraData ====== " + "contentHeader: " + JSON.stringify(this.contentHeader));
        headers['Authorization'] = this.contentHeader || '';
        options.headers = headers;

        //ft.onProgress(this.onProgress);
        let filenameURL = filename.slice(0, -4).toString();
        console.log("CameraData ====== " + "params['rami']: " + params['rami']);
        console.log("CameraData ====== " + "filenameURL: " + filenameURL);
        console.log("CameraData ====== " + "filename: " + filename);
        ft.upload(fileURL, this.globals.FILE_TRANSFER_URL + filenameURL, options, false)
          .then((result: any) => {
            this.success(result);
          }).catch((error: any) => {
          this.failed(error);
        });
      },300);
    },300);

  };



  success = (result: any) : void => {
    console.log("CameraData ====== " + "result: " + JSON.stringify(result));
    if(this.current < this.total) {
      this.current++;
      this.progress = 0;
      //this.upload(this.images[this.current - 1]);
    } else {
      this.uploading = false;
    }
  };

  failed = (err: any) : void => {
    console.log(JSON.stringify(err));
    let code = err.code;
    console.log("Failed to upload image. Code: " + code);
  };

  onProgress =  (progressEvent: ProgressEvent) : void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        console.log(progress);
        this.progress = progress
      }
    });
  };
  /*
   takePicture_(){
   return Observable.create(observer => {
   //observer.next(this.takePictureFunction());
   observer.next(this.takePictureReturn());
   observer.complete();
   });
   }
   takePictureReturn(){
   return this.base64Image;
   }
   */
  takePicture(page, formID, isUpload, callback){
    this.refreshPage = page;
    this.platform.ready().then(() => {
      Camera.getPicture({
        ///destinationType: Camera.DestinationType.DATA_URL,
        destinationType: this.cameraDestinationType,
        encodingType: Camera.EncodingType.JPEG,
        quality : 75,
        targetWidth: 700,
        targetHeight: 700,
        allowEdit: true,
        correctOrientation: true
      }).then((imageData) => {

        this.base64Image = this.deviceService.getImageData(imageData);
        //console.log("base64Image: " + this.base64Image);
        this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
        //console.log("imageLocalStorage: " + this.imageLocalStorage);
        //this.uploadImage(this.base64Image);
        //this.upload(this.base64Image);
        this.setPhotosToUpload(formID, this.imageLocalStorage);
        if(isUpload){
          this.upload(this.base64Image, '');
        }
        //this.storage.set('base64Image', this.imageLocalStorage);
        console.log("CameraData ====== " + "base64Image: " + this.base64Image);
        //console.log("this.refreshPage: " + this.refreshPage);
        //this.nav.push(this.refreshPage);
        callback(this.base64Image);

      }, (err) => {
        console.log(err);
        return;
      });
    })
  }

  getBase64Image(){
    this.storage.get('base64Image').then(base64Image => {
      console.log("CameraData ====== " + "IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //console.log('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }

  getImageToUpload(entityId, formID){
    //console.log('getImageToUpload -- entityId: ' + entityId);
    //console.log('getImageToUpload -- formID: ' + formID);

    this.storage.get(formID).then(form => {

      console.log("get camera ****************************************");
      console.log("CameraData ====== " + JSON.stringify(form));
      console.log("get camera ****************************************");

      for(let photo in form[formID]["photos"]){
        //console.log("IN getBase64Image");
        if(this.deviceService.getImageLocalStorage(photo).length>-1){
          let imageToUpload = this.deviceService.getImageLocalStorage(photo);
          console.log("CameraData ====== " + 'imageToUpload: ' + imageToUpload);
          this.upload(imageToUpload, entityId);
          //console.log('base64Image: ' + this.base64Image);
        }
      }
      if(form["contacts"].length === -1){
        //this.storage.remove(formID);
      }
    }).catch(error => {
      console.log(error);
    });

    /*
     this.storage.get('base64Image').then(base64Image => {
     //console.log("IN getBase64Image");
     if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
     let imageToUpload = this.deviceService.getImageLocalStorage(base64Image);
     console.log('imageToUpload: ' + imageToUpload);
     this.upload(imageToUpload, entityId);
     //console.log('base64Image: ' + this.base64Image);
     }

     //return this.base64Image;

     }).catch(error => {
     console.log(error);
     });
     */
  }
  /*
   getGalleryPic_(){
   return Observable.create(observer => {
   //observer.next(this.getGalleryPicFunction());
   observer.next(this.getGalleryPicReturn());
   observer.complete();
   });
   }
   getGalleryPicReturn(){
   if(this.base64Image === 'img/avatar3.png'){
   return this.base64Image;
   } else {
   return "file://" + this.base64Image;
   }
   }
   */
  getGalleryPic(page, formID, isUpload, callback){
    this.refreshPage = page;
    this.platform.ready().then(() => {
      Camera.getPicture({
        ///destinationType: Camera.DestinationType.DATA_URL,
        destinationType: this.cameraDestinationType,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        correctOrientation: true
      }).then((imageData) => {
        this.base64Image =  'img/loading.gif';
        this.storage.remove('base64Image');
        //this.deviceService.clearCache();
        console.log("CameraData ====== " + "imageData: " + imageData);
        setTimeout(() => {
          this.base64Image = this.deviceService.getImageData(imageData);
          console.log("CameraData ====== " + "getGalleryPic: " + this.base64Image);
          this.deviceService.getLocalFileSystemURL(this.base64Image);

        }, 300);

        setTimeout(() => {
          console.log("CameraData ====== " + "getGalleryPic - imageData: " + imageData);
          //console.log("base64Image: " + this.base64Image);
          this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
          //console.log("imageLocalStorage: " + this.imageLocalStorage);

          //this.storage.set('base64Image', this.imageLocalStorage);
          this.setPhotosToUpload(formID, this.imageLocalStorage);
          //this.upload("file://" + this.base64Image);
          if(isUpload){
            this.upload(this.base64Image, '');
          }
          console.log("CameraData ====== " + "file:// + this.base64Image: " + "file://" + this.base64Image);
          //console.log("this.refreshPage: " + this.refreshPage);
          //this.nav.push(this.refreshPage);
          callback(this.base64Image);
        }, 300);
      }, (err) => {
        console.log(err);
        return;
      });
    })
  }




  getDevicePlatform(){

    let deviceType = this.platform.is('android')? 'android'
      :this.platform.is('cordova')? 'cordova'
      :this.platform.is('core')? 'core'
      :this.platform.is('ios')? 'ios'
      :this.platform.is('ipad')? 'ipad'
      :this.platform.is('iphone')? 'iphone'
      :this.platform.is('mobile')? 'mobile'
      :this.platform.is('mobileweb')? 'mobileweb'
      :this.platform.is('phablet')? 'phablet'
      :this.platform.is('tablet')? 'tablet'
      :this.platform.is('windows')? 'windows'
      :null;

    return deviceType;

  }
  getCameraDestinationType(){
    let cameraDestinationType = (this.getDevicePlatform() === 'android')? Camera.DestinationType.FILE_URI
      :(this.getDevicePlatform() === 'ios')? Camera.DestinationType.NATIVE_URI
      :(this.getDevicePlatform() === 'ipad')? Camera.DestinationType.NATIVE_URI
      :(this.getDevicePlatform() === 'iphone')? Camera.DestinationType.NATIVE_URI
      :Camera.DestinationType.DATA_URL;

    return cameraDestinationType;
  }
  getImageData(data){
    let imageData = (this.getDevicePlatform() === 'android')? data
      :(this.getDevicePlatform() === 'ios')? data
      :(this.getDevicePlatform() === 'ipad')? data
      :(this.getDevicePlatform() === 'iphone')? data
      :"data:image/jpeg;base64," + data;
    return imageData;

  }
  setImageLocalStorage(data){
    let imageData = (this.getDevicePlatform() === 'android')? data
      :(this.getDevicePlatform() === 'ios')? data
      :(this.getDevicePlatform() === 'ipad')? data
      :(this.getDevicePlatform() === 'iphone')? data
      :JSON.stringify(data);
    return imageData;
  }
  getImageLocalStorage(data){
    let imageData = (this.getDevicePlatform() === 'android')? data
      :(this.getDevicePlatform() === 'ios')? data
      :(this.getDevicePlatform() === 'ipad')? data
      :(this.getDevicePlatform() === 'iphone')? data
      :JSON.parse(data);
    return imageData;
  }

  /**
   clearCache(){
    this.platform.ready().then(() => {
      let success = function(status) {
        //console.log('Message: ' + status);
      }

      let error = function(status) {
        //console.log('Error: ' + status);
      }
        //shidrog

      //window.cache.clear( success, error );
      //window.cache.cleartemp();

    })
    }
   */

  unixName() {
    let d = new Date();
    let n = d.getTime();
    return n + ".jpg";
  }
  unixID() {
    let d = new Date();
    let n = d.getTime();
    return n.toString();
  }

  //shidrog
  /*
   getLocalFileSystemURL(image){
   function resolveLocalFileErrorHandler(error) {
   console.log(error);
   }
   function resolveLocalFileSuccessHandler(fileEntry) {
   window.localStorage.setItem('filePath', fileEntry.toInternalURL());
   //window.localStorage.setItem('filePath2', fileEntry.toInternalURL());
   }

   window.resolveLocalFileSystemURL(image, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);
   }
   */
  getLocalFileSystemURL(image){
    File.resolveLocalFilesystemUrl(image)
      .then(() => resolveLocalFileSuccessHandler(image))
      .catch((e) => resolveLocalFileErrorHandler(e));

    function resolveLocalFileErrorHandler(error) {
      console.log('File doesnt exist', error);
    }
    function resolveLocalFileSuccessHandler(fileEntry) {
      console.log('File exists');
      window.localStorage.setItem('filePath', fileEntry.toInternalURL());
      //window.localStorage.setItem('filePath2', fileEntry.toInternalURL());
    }
    //shidrog
    //window.resolveLocalFileSystemURL(image, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);
    //File.resolveLocalFilesystemUrl(image, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);

  }

  setPhotosToUpload(formID, newPhoto) {
    console.log("setPhotosToUpload 2 -- formID: " + formID);
    console.log("setPhotosToUpload 2 -- newPhoto: " + newPhoto);

    this.storage.get(formID).then(form => {
      console.log("form: " + JSON.stringify(form));
      console.log("form[contacts]: " + JSON.stringify(form["contacts"]));
      console.log("form[contacts]2: " + form[formID]["contacts"]);

      if(form[formID]["photos"] === undefined || form[formID]["photos"].length === -1){
        form[formID]["photos"] = [];
        form[formID]["photos"][form[formID]["photos"].length] = newPhoto;
      } else {
        form[formID]["photos"][form[formID]["photos"].length] = newPhoto;
      }

      console.log("************" + JSON.stringify(form));
      this.storage.remove(formID);
      this.storage.set(formID, form);

    }).catch(error => {
      console.log(error);
    });
  }

}