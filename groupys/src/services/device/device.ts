import {Injectable} from '@angular/core';
//import {tokenNotExpired} from 'angular2-jwt';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Camera, File} from 'ionic-native';


@Injectable()
export class DeviceService {

  //local: Storage = new Storage(LocalStorage);
  local:any;
  
  constructor(private storage: Storage, private platform: Platform) {
    this.local = storage;
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
      //shidrog
      /*
      window.cache.clear( success, error );
      window.cache.cleartemp();
      */
    })
  }
  unixName() {
    let d = new Date();
    let n = d.getTime();
    return n + ".jpg";
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

  

}