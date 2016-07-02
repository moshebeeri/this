import {Page, NavController, Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {FORM_DIRECTIVES} from '@angular/common';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth';
import {GlobalsService} from '../../services/globals/globals';
const map = require('rxjs/add/operator/map');

@Page({
  templateUrl: 'build/pages/login/login.html',
  directives: [FORM_DIRECTIVES],
  providers : [AuthService, GlobalsService]
})
export class LoginPage {

  // When the page loads, we want the Login segment to be selected
  authType: string = "login";
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper: JwtHelper = new JwtHelper();
  local: Storage = new Storage(LocalStorage);
  user: string;

  constructor(private http: Http, private auth: AuthService, private globals: GlobalsService) {
    this.auth = auth;
    this.globals = globals;
    let token = this.local.get('token')._result;
    if(token) {
      this.user = this.jwtHelper.decodeToken(token).username;
    }
  }
  
  login(credentials) {
    this.http.post(this.globals.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
            data => this.authSuccess(data.token),
            err => this.error = err
        );
  }

  signup(credentials) {
    this.http.post(this.globals.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
            data => this.authSuccess(data.token),
            err => this.error = err
        );
  }

  logout() {
    this.local.remove('token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    this.local.set('token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
  }
}
