import {Injectable} from 'angular2/core';

@Injectable()
export class GlobalsService {
    constructor() {
	/*
		if (window.location.host.match("localhost:9000")) {
            return this.API = 'http://localhost:9000/api/';
        } else {
            return this.API = 'http://enter2-tabstorm.rhcloud.com/api/';
        }
		*/
	
	}
	

    LOGIN_URL: string = "http://localhost:9000/api/local";
    SIGNUP_URL: string = "http://localhost:9000/api/users";
    ME_URL: string = "http://localhost:9000/api/users/me";
}








