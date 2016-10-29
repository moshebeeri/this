import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class GlobalHeaders {
    contentHeader: Headers = new Headers({"Content-Type": "application/json"});
    local: Storage = new Storage(LocalStorage);
	
  constructor() {
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