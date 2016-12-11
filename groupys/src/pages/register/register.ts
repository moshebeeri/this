import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, Headers} from '@angular/http';

import { Sim } from 'ionic-native';
//import {FORM_DIRECTIVES,FormBuilder,ControlGroup} from '@angular/common';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {GlobalsService} from '../../services/globals/globals';
import {AuthService} from '../../services/auth/auth';
import {GlobalHeaders} from '../../services/headers/headers';
import {CountriesService} from '../countries/countries-service';
import {CountriesPage} from '../countries/countries';
import {HomePage} from '../home/home';
import {MyAccountPage} from '../my-account/my-account';
import {Observable} from 'rxjs/Observable';

//const map = require('rxjs/add/operator/map');

@Component({
  templateUrl: 'register.html',
  //directives: [FORM_DIRECTIVES],
  providers : [GlobalsService, GlobalHeaders, AuthService, CountriesService]
})
export class RegisterPage {

  // When the page loads, we want the Login segment to be selected
  error: string;
  local: any;
  contentHeader: Headers = new Headers();
  countryName:string;
  callingCodes:string;
  callingDigits:string;
  digitsValidator:string;
  callingDigitsInput:number;
  validatorLength:number;
  currentUser: any;
  currentToken: any;

  isLoggedIn: any;
  isAuthorized: any;
  isAdmin: any;
  
  baseURL: string;
  tmpCountryCode: any;
  clientIp: string;
  todo: any;
  loginCred: any;

  
  /*static get parameters() {
    return [[NavController], [Http], [GlobalsService], [GlobalHeaders], [AuthService]];
  }*/

  constructor(private storage: Storage, private nav:NavController, private platform: Platform, private http:Http, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private auth:AuthService, private countriesService:CountriesService) {

    this.local = storage;
    //this.resetLocalStorage();
    this.nav = nav;
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.auth = auth;
    this.countriesService = countriesService;

    this.baseURL = this.globals.BASE_URL;
    /*
     this.isLoggedIn = auth.isLoggedIn();
     this.isAuthorized = auth.isAuthorized('user');
     this.isAdmin = auth.isAdmin();
     auth.isAuthorized('user').subscribe(data => alert("====================" + data));
     */

    this.isAuthorizedPromise('user');
    this.isLoggedInPromise();
    this.isAdminPromise();

    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx111111111111111" + JSON.stringify(this.contentHeader));
    this.error = null;
    this.callingDigitsInput= null;
    this.validatorLength=-99;
    this.todo = {};
    this.loginCred = {};
    this.currentUser = {};
    this.currentToken = {};
    this.isAuthorizedPromise('user');

    this.getCurrentCountry().subscribe(data => console.log(data));
    this.local.set('isSIM', 'true');

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

  isAuthorizedPromise(role) {
    this.local.get('user').then(user => {
      let currentUser = JSON.parse(user);
      //alert("=============currentUser: " + JSON.stringify(currentUser));
      //alert("role: " + currentUser["role"]);
      if(currentUser && currentUser["role"].indexOf(role) > -1){
        this.isAuthorized = true;
      } else {
        this.isAuthorized = false;
      }
    }).catch(error => {
      console.log(error);
    });
  }
  isLoggedInPromise() {
    this.local.get('user').then(user => {
      let currentUser = JSON.parse(user);
      //alert(JSON.stringify(currentUser));
      console.log(currentUser);
      console.log(currentUser["sms_verified"]);
      if(currentUser && currentUser["sms_verified"] === true){
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }).catch(error => {
      console.log(error);
    });
  }
  isAdminPromise() {
    this.local.get('user').then(user => {
      let currentUser = JSON.parse(user);
      if(!!currentUser && currentUser["role"] === 'admin'){
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      return false;
    }).catch(error => {
      console.log(error);
    });
  }
  getCurrentUserPromise() {
    this.local.get('user').then(user => {
      this.currentUser = JSON.parse(user);

      this.isAuthorizedPromise('user');
      this.isLoggedInPromise();
      this.isAdminPromise();
    }).catch(error => {
      console.log(error);
    });
  }

  logForm() {
    console.log(this.todo);
  }

  resetLocalStorage(){
    //alert("remove all data");
    this.local.clear();
  }

  getCurrentCountry(){
    return Observable.create(observer => {
      observer.next(this.getClientIp());
      observer.next(this.getLocalCountryCode());
      setTimeout(() => {
        observer.next(this.findCountryByName());
      }, 0);
      setTimeout(() => {
        observer.next(this.getCountryDetails());
        observer.complete();
      }, 250);

    });
  }

  getCurrentCountry2(){
    return Observable.create(observer => {
      observer.next(this.getLocalCountryCode());
      setTimeout(() => {
        observer.next(this.findCountryByName());
        observer.complete();
      }, 250);
    });
  }

  getLocalCountryCode(){
    //alert("22222222222222222");
    //alert("ip:" + this.clientIp);
    this.tmpCountryCode = window.localStorage.getItem('countryCode') || JSON.stringify('il');
    //alert(this.tmpCountryCode);
    return this.tmpCountryCode;
  }

  findCountryByName(){
    //alert("333333333333333333333");
    //alert(JSON.parse(this.tmpCountryCode));
    this.countriesService.findByName(JSON.parse(this.tmpCountryCode)).subscribe(
      data => this.setDefaultCountry(data)
    );
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
    Sim.getSimInfo().then(
      (info) => this.successCallback(info),
      (err) => this.errorCallback(err)
    );

    /*this.platform.ready().then(() => {
      window.plugins.sim.getSimInfo(this.successCallback, this.errorCallback);
    });*/

  }

  successCallback(info) {
    console.log('Sim info: ', info)
    //alert("1: " + JSON.stringify(result.countryCode));
	  window.localStorage.setItem('countryCode', JSON.stringify(info.countryCode));
	  //alert(JSON.stringify(this.local.get('countryCode')));
  }
  errorCallback(err) {
    console.log('Unable to get sim info: ', err);
    //alert(error);
    this.nav.push(CountriesPage);
  }
  setDefaultCountry(data) {
    //alert("setDefaultCountry");
    //alert(JSON.stringify(data));
    this.local.get('isSIM').then(isSIM => {
      //alert("isSIM: " + JSON.parse(isSIM));
      if(JSON.parse(isSIM)){
        /*
        alert("in SIM");
        alert(JSON.stringify(data[0].name));
        alert(JSON.stringify(data[0].callingCodes));
        alert(JSON.stringify(data[0].callingDigits));
        alert(JSON.stringify(data[0].digitsValidator));
        */

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
    //alert('44444444444444444444');
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

  register() {
    let credentials = {};
    credentials = this.loginCred;
    //alert(JSON.stringify(credentials));
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
  
  verification() {
    let credentials = this.loginCred;
    alert(this.loginCred);
    if(credentials["code"] == null) {
      this.error = 'Code number can not be empty';
      console.log(this.error);
      return;
    } else if(credentials["code"].length != 4){
      this.error = 'Please enter a valid code';
      console.log(this.error);
      return;
    }

    this.local.get('token').then(token => {
      this.currentToken = token;

      this.contentHeader = new Headers({"Content-Type": "application/json"});
      this.contentHeader.append('Authorization', 'Bearer ' + this.currentToken);

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

    }).catch(error => {
      console.log(error);
    });


  }
  updateCurrentUser(){
    //let user = this.auth.getCurrentUser();
    this.getCurrentUserPromise();
    this.currentUser["sms_verified"] = true;
    this.auth.setCurrentUser(this.currentUser);
    /*
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();
    */
    this.isAuthorizedPromise('user');
    this.isLoggedInPromise();
    this.isAdminPromise();

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
    //this.currentUser = this.auth.getCurrentUser();
    this.getCurrentUserPromise();
    //alert(this.currentUser["_id"]);
    //alert(JSON.stringify(this.currentUser));
    /*
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();
    */

  }

  getClientIp(){
    //alert("1111111111111111111");
    this.http.get(this.globals.IP_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.clientIp = data,
        err => this.error = err
        //() => alert(this.clientIp)
      );
  }
  printObject(object){
    let output = '';
    for (let property in object) {
      output += property + ': ' + object[property]+'; ';
    }
    console.log(output);
  }
}
