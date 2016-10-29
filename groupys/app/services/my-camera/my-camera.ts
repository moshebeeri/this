import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Platform, Storage, LocalStorage, NavController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Camera, Transfer} from 'ionic-native';
import {GlobalHeaders} from '../headers/headers';
import {DeviceService} from '../device/device';
import {GlobalsService} from '../globals/globals';
import {NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {MyAccountPage} from '../../pages/my-account/my-account';

@Injectable()
export class MyCameraService {

  local: Storage = new Storage(LocalStorage);
  contentHeader: Headers = new Headers();

  cameraDestinationType: any;
  public base64Image: string;
  public imageLocalStorage: string;

  uploading: boolean = true;
  current: number = 1;
  total: number;
  progress: number;
  refreshPage: any;
  entityId: any;
  
  constructor(public nav: NavController, private platform: Platform, private globalHeaders:GlobalHeaders, private deviceService: DeviceService, private globals: GlobalsService, private ngZone: NgZone) {
    this.nav = nav;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();

    this.cameraDestinationType = this.deviceService.getCameraDestinationType();

    this.base64Image =  'img/avatar3.png';
    this.getBase64Image();

  }


  upload = (image: string, id: string) : void => {
    alert(image);
    alert(id);
    alert("this.contentHeader: "+ this.contentHeader);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx222222222222222222222222222" + JSON.stringify(this.contentHeader));

    this.deviceService.getLocalFileSystemURL(image);
    setTimeout(() => {
      this.local.get('filePath').then(filePath => {
        //this.base64Image2 = filePath;
        let fileURL = filePath;
        alert("filePath: " + filePath);


        let ft = new Transfer();
        //alert(ft);
        let filename = fileURL.substr(fileURL.lastIndexOf('/') + 1).toString();
        alert("------------------ filename: " + filename);
        if(filename === '.Pic.jpg' || filename === undefined){
          filename = this.deviceService.unixName();
        }

        let options = new FileUploadOptions();
        options.fileKey ='avatar';
        options.fileName = id + '--' + filename;
				alert("------------------ filename: " + options.fileName);
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
        console.log("-------------------------- this.contentHeader ----------------------------");
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx33333333333333333333333" + JSON.stringify(this.contentHeader));
        headers['Authorization'] = this.contentHeader || '';
        options.headers = headers;

        //ft.onProgress(this.onProgress);
        let filenameURL = filename.slice(0, -4).toString();
        alert("params['rami']: " + params['rami']);
        alert(filenameURL);
        alert(filename);
        ft.upload(fileURL, this.globals.FILE_TRANSFER_URL + filenameURL, options, false)
          .then((result: any) => {
            this.success(result);
          }).catch((error: any) => {
          this.failed(error);
        });
      });

    }, 1000);
  };



  success = (result: any) : void => {
    alert(JSON.stringify(result));
    if(this.current < this.total) {
      this.current++;
      this.progress = 0;
      //this.upload(this.images[this.current - 1]);
    } else {
      this.uploading = false;
    }
  };

  failed = (err: any) : void => {
    alert(JSON.stringify(err));
    let code = err.code;
    alert("Failed to upload image. Code: " + code);
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
  takePicture(page){
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
        //alert("base64Image: " + this.base64Image);
        this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
        //alert("imageLocalStorage: " + this.imageLocalStorage);
        //this.uploadImage(this.base64Image);
        //this.upload(this.base64Image);
        this.upload(this.base64Image, '');

        this.local.set('base64Image', this.imageLocalStorage);
        console.log("--------------- this.base64Image: " + this.base64Image);
        this.nav.push(this.refreshPage);

      }, (err) => {
        console.log(err);
        return;
      });
    })
  }

  getBase64Image(){
    this.local.get('base64Image').then(base64Image => {
      //alert("IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //alert('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }
  getImageToUpload(entityId){
		alert('entityId: ' + entityId);
    this.local.get('base64Image').then(base64Image => {
      //alert("IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        let imageToUpload = this.deviceService.getImageLocalStorage(base64Image);
				alert('imageToUpload: ' + imageToUpload);
				this.upload(imageToUpload, entityId);
        //alert('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
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
  getGalleryPic(page){
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
        this.local.remove('base64Image');
        this.deviceService.clearCache();
        setTimeout(() => {
          this.base64Image = this.deviceService.getImageData(imageData);
          alert("getGalleryPic  file://" + this.base64Image);
          this.deviceService.getLocalFileSystemURL("file://" + this.base64Image);

        }, 300);

        setTimeout(() => {
          alert("getGalleryPic - imageData: " + imageData);
          //alert("base64Image: " + this.base64Image);
          this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
          //alert("imageLocalStorage: " + this.imageLocalStorage);

          this.local.set('base64Image', this.imageLocalStorage);
          //this.upload("file://" + this.base64Image);
          this.upload("file://" + this.base64Image, '');
          console.log("--------------- file:// + this.base64Image: " + "file://" + this.base64Image);
          this.nav.push(this.refreshPage);
        }, 1000);
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
  clearCache(){
    this.platform.ready().then(() => {
      var success = function(status) {
        //alert('Message: ' + status);
      }

      var error = function(status) {
        //alert('Error: ' + status);
      }

      window.cache.clear( success, error );
      window.cache.cleartemp();
    })
  }
  unixName() {
    let d = new Date();
    let n = d.getTime();
    return n + ".jpg";
  }

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

  

}