import {Injectable} from '@angular/core';
//import {Http, Headers} from '@angular/http';
import {Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

@Injectable()
export class HeaderData {
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});

  constructor(private storage: Storage) {
    this.storage.get('token').then(token => {
      return this.contentHeader.append('Authorization', 'Bearer ' + token);
    }).catch(error => {
      console.log(error);
    });
    this.getMyGlobalHeaders();
  }
  
	getMyGlobalHeaders() {
    return this.contentHeader;
	}
}