import {Injectable} from '@angular/core';
//import {Http, Headers} from '@angular/http';
import {Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

@Injectable()
export class GlobalHeaders {
    contentHeader: Headers = new Headers({"Content-Type": "application/json"});
    local: any;
	
  constructor(private storage: Storage) {
    this.local = storage;

    this.local.get('token').then(token => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      //alert(JSON.stringify(this.contentHeader));
      console.log("111111111111111111111----------------------------" + JSON.stringify(this.contentHeader));
    }).catch(error => {
      console.log(error);
    });
    this.getMyGlobalHeaders();
	}
	getMyGlobalHeaders() {
    //alert("getMyGlobalHeaders");
    //alert(JSON.stringify(this.contentHeader));
		return this.contentHeader;
	}
}