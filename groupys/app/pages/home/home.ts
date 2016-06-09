import {Page} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from '../../services/auth/auth';
//import {GeolocationService} from '../../services/geolocation/geolocation';


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers : [Geolocation]
})
export class HomePage {

  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  currentLatitude: number;
  currentLongitude: number;
  EM:any; // no type def for EM yet
  
  constructor(private auth: AuthService) {

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
}
