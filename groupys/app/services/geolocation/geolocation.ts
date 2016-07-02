import {Injectable} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class GeolocationService {

  local: Storage = new Storage(LocalStorage);
  currentLatitude: number;
  currentLongitude: number;
  
  constructor() {
    Geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
      console.log("Latitude: ", resp.coords.latitude);
      console.log("Longitude: ", resp.coords.longitude);
    });
	}
  getLatitude() {
    return this.currentLatitude;
  }
  getLongitude() {
    return this.currentLongitude
  }
}