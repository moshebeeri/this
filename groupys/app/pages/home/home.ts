import {Page} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from '../../services/auth/auth';
import {Http, Headers} from 'angular2/http';
import {GlobalsService} from '../../services/globals/globals';
import {GlobalHeaders} from '../../services/headers/headers';
//import {GeolocationService} from '../../services/geolocation/geolocation';


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers : [Geolocation, GlobalsService, GlobalHeaders]
})
export class HomePage {

  contentHeader: Headers = new Headers();
  error: string;
  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  currentLatitude: number;
  currentLongitude: number;
  EM:any; // no type def for EM yet

  constructor(private auth: AuthService, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private http:Http) {

    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
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

  checkContact(number){
    this.http.get(this.globals.PHONE_NUMBER_URL + number, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        err => this.error = err,
        () => console.log('Phone Number Found')
      );
  }
}
