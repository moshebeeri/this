import {Injectable} from 'angular2/core';

@Injectable()
export class GlobalsService {

    BASE_URL: string;
    LOGIN_URL: string;
    SIGNUP_URL: string;
    ME_URL: string;
    METADATA_URL: string;

    constructor() {
	
		if (window.location.host.match("localhost")) {
            this.BASE_URL = "http://localhost:9000/api/";
        } else {
            this.BASE_URL = "http://low.la:9000/api/";
        }
        this.LOGIN_URL = this.BASE_URL + "local";
        this.SIGNUP_URL = this.BASE_URL + "users";
        this.ME_URL = this.BASE_URL + "users/me";
        this.VERIFICATION_URL = this.BASE_URL + "users/verification/";
        this.METADATA_URL = this.BASE_URL + "breeze/metadata";

	}



}








