import {Page, NavController, Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {FORM_DIRECTIVES,FormBuilder,ControlGroup} from '@angular/common';
import {GlobalsService} from '../../services/globals/globals';
import {AuthService} from '../../services/auth/auth';
import {GlobalHeaders} from '../../services/headers/headers';
import {CountriesPage} from '../countries/countries';
import {HomePage} from '../home/home';
const map = require('rxjs/add/operator/map');

@Page({
  templateUrl: 'build/pages/register/register.html',
  directives: [FORM_DIRECTIVES],
  providers : [GlobalsService, GlobalHeaders, AuthService]
})
export class RegisterPage {

  // When the page loads, we want the Login segment to be selected
  error: string;
  local: Storage = new Storage(LocalStorage);
  contentHeader: Headers = new Headers();
  countryName:string;
  callingCodes:string;
  callingDigits:string;
  digitsValidator:string;
  callingDigitsInput:number;
  validatorLength:number;
  currentUser: string;

  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  
  baseURL: string;
  
  /*static get parameters() {
    return [[NavController], [Http], [GlobalsService], [GlobalHeaders], [AuthService]];
  }*/

  constructor(private nav:NavController, private http:Http, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private auth:AuthService) {
    this.nav = nav;
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.auth = auth;

    this.baseURL = this.globals.BASE_URL;
    this.isLoggedIn = this.auth.isLoggedIn();
    //this.isLoggedIn = false;
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();

    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(this.contentHeader));
    this.error = null;
    this.callingDigitsInput= null;
    this.validatorLength=-99;
    this.getCountryDetails();
    
  }

  validateNumbers(evt){
    if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(evt.keyCode || evt.which) == -1){
      evt.returnValue = false;
      if(evt.preventDefault){evt.preventDefault();}
    }
  }
  
  getCountryDetails(){
    this.local.get('countryNameDetails').then(countryNameDetails => {
      this.countryName = JSON.parse(countryNameDetails);
      console.log('countryName' + this.countryName);
    }).catch(error => {
      console.log(error);
    });
    this.local.get('callingCodesDetails').then(callingCodesDetails => {
      this.callingCodes = JSON.parse(callingCodesDetails);
      console.log('callingCodes' + this.callingCodes);
    }).catch(error => {
      console.log(error);
    });
    this.local.get('callingDigitsDetails').then(callingDigitsDetails => {
      this.callingDigits = JSON.parse(callingDigitsDetails);
      console.log('callingDigits' + this.callingDigits);
    }).catch(error => {
      console.log(error);
    });
	  this.local.get('digitsValidator').then(digitsValidator => {
      this.digitsValidator = JSON.parse(digitsValidator);
      console.log('digitsValidator' + this.digitsValidator);
      document.getElementById("phoneInput").setAttribute("maxlength", this.digitsValidator);
      document.getElementById("phoneInput").getElementsByTagName( 'input' )[0].setAttribute("maxlength", this.digitsValidator);
      }).catch(error => {
        console.log(error);
    });
    
  }
  itemTapped() {
    this.nav.push(CountriesPage);
  }

  register(credentials) {

    if(credentials["callingDigits"] == null) {
      this.error = 'Phone number can not be empty';
      console.log(this.error);
      return;
    } else if(credentials["callingDigits"].length != this.digitsValidator){
      this.error = 'Please enter a valid phone number';
      console.log(this.error);
      return;
    }
    credentials["phone_number"] = this.callingCodes + credentials["callingDigits"];
    /*
    credentials["username"] = 'rami raz';
    credentials["email"] = 'ramiraz76@gmail.com';
    credentials["password"] = 'password';
    */
    console.log(JSON.stringify(credentials));
    console.log(JSON.stringify(this.contentHeader));
	
    this.http.post(this.globals.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => this.authSuccess(data.token),
          err => this.error = err,
          () => console.log('Register request Complete')
        );
  }
  
  verification(credentials) {
    let token = this.local.get('token');
    token = token.__zone_symbol__value;
    this.contentHeader = new Headers({"Content-Type": "application/json"});
    this.contentHeader.append('Authorization', 'Bearer ' + token);

    if(credentials["code"] == null) {
      this.error = 'Code number can not be empty';
      console.log(this.error);
      return;
    } else if(credentials["code"].length != 4){
      this.error = 'Please enter a valid code';
      console.log(this.error);
      return;
    }

    console.log("------------------------verification---------------------------");
    console.log("credentials: " + JSON.stringify(credentials));
    console.log("this.contentHeader: " + JSON.stringify(this.contentHeader));
    console.log("--------------------------------------------------------------------");
	
    this.http.get(this.globals.VERIFICATION_URL + credentials["code"], { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
            err => this.error = err,
			      () => this.updateCurrentUser()
        );
  }
  updateCurrentUser(){
    let user = this.auth.getCurrentUser();
    user.sms_verified = true;
    this.auth.setCurrentUser(user);

    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();

    this.nav.setRoot(HomePage);
  }

  logout() {
    this.auth.logout();
	  this.contentHeader = new Headers({"Content-Type": "application/json"});
    this.nav.setRoot(HomePage);
  }

  authSuccess(token) {
    console.log("token---------------------------------------" + token);
    this.error = null;
    this.auth.setToken(token);
    this.contentHeader = new Headers({"Content-Type": "application/json"});
    this.contentHeader.append('Authorization', 'Bearer ' + token);

    console.log("contentHeader---------------------------------------" + JSON.stringify(this.contentHeader));
    this.http.get(this.globals.ME_URL, { headers: this.contentHeader})
    .map(res => res.json())
    .subscribe(
        data => this.setCurrentUser(data),
        err => this.error = err
  //() => this.nav.setRoot(HomePage)
    );
  }
  
  setCurrentUser(data){
    this.auth.setCurrentUser(data);
    this.currentUser = this.auth.getCurrentUser();
    console.log(this.currentUser._id);
    console.log( JSON.stringify(this.currentUser));
    this.isLoggedIn = this.auth.isLoggedIn();
    //this.isLoggedIn = true;
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();
  }

  printObject(object){
    let output = '';
    for (let property in object) {
      output += property + ': ' + object[property]+'; ';
    }
    console.log(output);
  }
}
