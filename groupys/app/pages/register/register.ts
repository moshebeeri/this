import {Page, NavController, Storage, LocalStorage, Platform} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {FORM_DIRECTIVES,FormBuilder,ControlGroup} from '@angular/common';
import {GlobalsService} from '../../services/globals/globals';
import {AuthService} from '../../services/auth/auth';
import {GlobalHeaders} from '../../services/headers/headers';
import {CountriesService} from '../countries/countries-service';
import {CountriesPage} from '../countries/countries';
import {HomePage} from '../home/home';
import {MyAccountPage} from '../my-account/my-account';
import {Observable} from 'rxjs/Observable';
const map = require('rxjs/add/operator/map');

@Page({
  templateUrl: 'build/pages/register/register.html',
  directives: [FORM_DIRECTIVES],
  providers : [GlobalsService, GlobalHeaders, AuthService, CountriesService]
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

  constructor(private nav:NavController, private platform: Platform, private http:Http, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private auth:AuthService, private countriesService:CountriesService) {
    
    this.nav = nav;
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.auth = auth;
    this.countriesService = countriesService;

    this.baseURL = this.globals.BASE_URL;
    this.isLoggedIn = this.auth.isLoggedIn();
    //this.isLoggedIn = false;
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();

    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx111111111111111" + JSON.stringify(this.contentHeader));
    this.error = null;
    this.callingDigitsInput= null;
    this.validatorLength=-99;
	
	this.getCurrentCountry().subscribe(data => console.log(data));
	/*
	//this.getcountries();
	this.getCountryFromSim();
	setTimeout(() => {
      this.getCountries();
    }, 1);
	setTimeout(() => {
      this.getCountryDetails();
    }, 1000);
	*/
  }
  getCurrentCountry(){
	return Observable.create(observer => {
		observer.next(this.getCountryFromSim());
		setTimeout(() => {
			observer.next(this.getCountries());
		}, 250);
		setTimeout(() => {
			observer.next(this.getCountryDetails());
			observer.complete();
		}, 250);
		
	});
  }

  getCountries(){
    this.local.get('countryCode').then(countryCode => {
      //alert("countryCode: " + JSON.parse(countryCode));
      this.countriesService.findByName(JSON.parse(countryCode)).subscribe(
        data => this.setDefaultCountry(data)
      );
    }).catch(error => {
      console.log(error);
    });
  }
  getCountryFromSim(){
    this.platform.ready().then(() => {
      window.plugins.sim.getSimInfo(this.successCallback, this.errorCallback);
    });

  }

  successCallback(result) {
    //alert("1: " + JSON.stringify(result.countryCode));
	  window.localStorage.setItem('countryCode', JSON.stringify(result.countryCode));
	  //alert(JSON.stringify(this.local.get('countryCode')));
  }
  errorCallback(error) {
    //alert(error);
    this.nav.push(CountriesPage);
  }
  setDefaultCountry(data) {
    //alert(JSON.stringify(data));
    this.local.get('isSIM').then(isSIM => {
	  //alert("isSIM: " + JSON.parse(isSIM));
	  if(JSON.parse(isSIM) === true){
		//alert("in SIM");
		this.local.set('countryNameDetails', JSON.stringify(data[0].name));
		this.local.set('callingCodesDetails', JSON.stringify(data[0].callingCodes));
		this.local.set('callingDigitsDetails', JSON.stringify(data[0].callingDigits));
		this.local.set('digitsValidator', JSON.stringify(data[0].digitsValidator));
		this.local.set('isSIM', 'false');
	  }
	}).catch(error => {
	  console.log(error);
	});

  }

  validateNumbers(evt){
    if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(evt.keyCode || evt.which) == -1){
      evt.returnValue = false;
      if(evt.preventDefault){evt.preventDefault();}
    }
  }
  
  getCountryDetails(){
	//alert('getCountryDetails');
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
	  document.getElementById("phoneInput").getElementsByTagName( 'input' )[0]["setAttribute"]("maxlength", this.digitsValidator);
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
    let phone_number = this.callingCodes + credentials["callingDigits"];
    credentials["phone_number"] = phone_number;
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
          data => this.authSuccess(data['token']),
          err => this.error = err,
          () => console.log('Register request Complete')
        );
  }
  
  verification(credentials) {
    let token = this.local.get('token');
    token = token["__zone_symbol__value"];
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

    //this.nav.setRoot(HomePage);
    this.nav.setRoot(MyAccountPage);
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
    console.log(this.currentUser["_id"]);
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
