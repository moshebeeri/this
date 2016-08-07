import {Page} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from '../../services/auth/auth';
import {Http, Headers} from '@angular/http';
import {global} from '@angular/core/src/facade/lang';
import {GlobalsService} from '../../services/globals/globals';
import {GlobalHeaders} from '../../services/headers/headers';
import {WindowService} from '../../services/windows/windows';
//import {GeolocationService} from '../../services/geolocation/geolocation';


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers : [Geolocation, GlobalsService, GlobalHeaders, WindowService]
})
export class HomePage {

  contentHeader: Headers = new Headers();
  error: string;
  plugin: string;
  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  currentLatitude: number;
  currentLongitude: number;
  EM:any; // no type def for EM yet
  cordova:any;
  navigator:any;
  win:any;


  constructor(private auth: AuthService, private windowService:WindowService, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private http:Http) {

    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.win = windowService;
    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();

    this.isLoggedIn = auth.isLoggedIn();
    this.isAuthorized = auth.isAuthorized('user');
    this.isAdmin = auth.isAdmin();
	
	  Geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
          console.log("Latitude: ", resp.coords.latitude);
          console.log("Longitude: ", resp.coords.longitude);
    });
	
	//this.currentLatitude = geolocation.getLatitude();
    //this.currentLongitude = geolocation.getLongitude();

    console.log("isLoggedIn2: " +  this.isLoggedIn);
    console.log("isAuthorized2: " +  this.isAuthorized);
    console.log("isAdmin2: " +  this.isAdmin);

  }

  checkPlugin(){
    this.plugin = JSON.stringify(navigator);
  }

  checkContact(number){
    this.http.get(this.globals.PHONE_NUMBER_URL + number, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        err => this.error = err,
        () => console.log('Phone Number Found')
      );
  }
  info0() {
    //let x = windowService();
    //console.log(window.plugins.sim);
    window.plugins.sim.getSimInfo(this.successCallback2, this.errorCallback2);
  }

  info1() {
    //console.log(window.plugins.sim);
    global.plugins.sim.getSimInfo(this.successCallback2, this.errorCallback2);
  }
  info2() {
    let nativeWindow = this.win.getNativeWindow();
    nativeWindow.plugins.sim.getSimInfo(this.successCallback2, this.errorCallback2);
  }
  successCallback2(result) {
    console.log(result);
    alert(JSON.stringify(result));
  }
  errorCallback2(error) {
    console.log(error);
  }
}
