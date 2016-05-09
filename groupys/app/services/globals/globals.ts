import {Injectable} from 'angular2/core';

@Injectable()
export class GlobalsService {
    constructor() {}

    LOGIN_URL: string = "http://localhost:3001/sessions/create";
    SIGNUP_URL: string = "http://localhost:3001/users";
}








