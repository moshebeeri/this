import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class GlobalHeaders {
    contentHeader: Headers = new Headers({"Content-Type": "application/json"});
    local: Storage = new Storage(LocalStorage);
	
    constructor() {
		let jwt = this.local.get('token');
		console.log("----------------------------------------------------------" + JSON.stringify(jwt.__zone_symbol__value));
		if(jwt.__zone_symbol__value) {
			this.contentHeader.append('Authorization', 'Bearer ' + jwt.__zone_symbol__value);      
		}
	}
	getMyGlobalHeaders() {
		return this.contentHeader;
    }
}