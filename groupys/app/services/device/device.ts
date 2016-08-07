import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Platform, Storage, LocalStorage} from 'ionic-angular';
import {Camera} from 'ionic-native';

@Injectable()
export class DeviceService {

  local: Storage = new Storage(LocalStorage);
  
  constructor(private platform: Platform) {}

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

  

}