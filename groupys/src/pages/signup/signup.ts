import { Component } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';
import { Storage} from '@ionic/storage';
import { Http, Headers} from '@angular/http';

import { Sim } from 'ionic-native';

import { UserData } from '../../providers/user-data';
import { CountryData } from '../../providers/country-data';
import { UrlData } from '../../providers/url-data';
import { HeaderData } from '../../providers/header-data';



import { SchedulePage } from '../schedule/schedule';
import { TabsPage } from '../tabs/tabs';
import { CountryPage } from '../country/country';
//import {HomePage} from '../home/home';
//import {MyAccountPage} from '../my-account/my-account';
import { Observable } from 'rxjs/Observable';

//const map = require('rxjs/add/operator/map');

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {

  // When the page loads, we want the Login segment to be selected
  error: string;
  local: any;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
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

  constructor(
    private storage: Storage,
    private nav:NavController,
    private platform: Platform,
    private http:Http,
    private urlData:UrlData,
    private headerData:HeaderData,
    private userData:UserData,
    private countryData:CountryData
  ) {

    this.baseURL = this.urlData.BASE_URL;
    this.getUserPermissions();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx111111111111111" + JSON.stringify(this.contentHeader));

    this.error = null;
    this.callingDigitsInput= null;
    this.validatorLength=-99;
    this.todo = {};
    this.loginCred = {};
    this.currentUser = {};
    this.currentToken = {};
    this.getCurrentCountry().subscribe(data => console.log(data));
    this.storage.set('isSIM', 'true');

    this.getCountryFromSim();


  }
  
  getUserPermissions(){
    this.userData.isLoggedIn().then((data) => {
      this.isLoggedIn = data;
    });

    this.userData.isAuthorized('user').then((data) => {
      this.isAuthorized =  data;
    });

    this.userData.isAdmin().then((data) => {
      this.isAdmin = data;
    });

    this.userData.getCurrentUser().then((data) => {
      this.currentUser = data;
    });
  }

  resetLocalStorage(){
    this.storage.clear();
  }

  getCurrentCountry(){
    return Observable.create(observer => {
      observer.next(this.getClientIp());
      observer.next(this.getCountryFromSim());
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
  getClientIp(){
    this.http.get(this.urlData.IP_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.clientIp = data,
        err => this.error = err
        //() => alert(this.clientIp)
      );
  }

  getCountryFromSim(){
    this.platform.ready().then(() => {
      Sim.getSimInfo().then(
        (info) => this.successCallback(info),
        (err) => this.errorCallback(err)
      );
    });

    /*this.platform.ready().then(() => {
     window.plugins.sim.getSimInfo(this.successCallback, this.errorCallback);
     });*/

  }
  successCallback(info) {
    console.log('Sim info: ', info);
    //alert("1: " + JSON.stringify(result.countryCode));
    window.localStorage.setItem('countryCode', JSON.stringify(info.countryCode));
    //alert(JSON.stringify(this.storage.get('countryCode')));
  }
  errorCallback(err) {
    console.log('Unable to get sim info: ', err);
    //alert(error);
    //this.nav.push(CountryPage);
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
    this.countryData.findByName(JSON.parse(this.tmpCountryCode)).subscribe(
      data => this.setDefaultCountry(data)
    );
  }


  setDefaultCountry(data) {
    //alert("setDefaultCountry");
    //alert(JSON.stringify(data));
    this.storage.get('isSIM').then(isSIM => {
      //alert("isSIM: " + JSON.parse(isSIM));
      if(JSON.parse(isSIM)){
        /*
         alert("in SIM");
         alert(JSON.stringify(data[0].name));
         alert(JSON.stringify(data[0].callingCodes));
         alert(JSON.stringify(data[0].callingDigits));
         alert(JSON.stringify(data[0].digitsValidator));
         */

        this.storage.set('countryNameDetails', JSON.stringify(data[0].name));
        this.storage.set('callingCodesDetails', JSON.stringify(data[0].callingCodes));
        this.storage.set('callingDigitsDetails', JSON.stringify(data[0].callingDigits));
        this.storage.set('digitsValidator', JSON.stringify(data[0].digitsValidator));
        this.storage.set('isSIM', 'false');
      }
    }).catch(error => {
      console.log(error);
    });

  }

  getCountryDetails(){
    //alert('44444444444444444444');
    this.storage.get('countryNameDetails').then(countryNameDetails => {
      this.countryName = JSON.parse(countryNameDetails);
      console.log('countryName' + this.countryName);
    }).catch(error => {
      console.log(error);
    });
    this.storage.get('callingCodesDetails').then(callingCodesDetails => {
      this.callingCodes = JSON.parse(callingCodesDetails);
      console.log('callingCodes' + this.callingCodes);
    }).catch(error => {
      console.log(error);
    });
    this.storage.get('callingDigitsDetails').then(callingDigitsDetails => {
      this.callingDigits = JSON.parse(callingDigitsDetails);
      console.log('callingDigits' + this.callingDigits);
    }).catch(error => {
      console.log(error);
    });
    this.storage.get('digitsValidator').then(digitsValidator => {
      this.digitsValidator = JSON.parse(digitsValidator);
      console.log('digitsValidator' + this.digitsValidator);
      document.getElementById("phoneInput").setAttribute("maxlength", this.digitsValidator);
      document.getElementById("phoneInput").getElementsByTagName( 'input' )[0]["setAttribute"]("maxlength", this.digitsValidator);
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

  itemTapped() {
    this.nav.push(CountryPage);
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

    this.http.post(this.urlData.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
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

    this.storage.get('token').then(token => {
      this.currentToken = token;

      this.contentHeader = new Headers({"Content-Type": "application/json"});
      this.contentHeader.append('Authorization', 'Bearer ' + this.currentToken);

      console.log("------------------------verification---------------------------");
      console.log("credentials: " + JSON.stringify(credentials));
      console.log("this.contentHeader: " + JSON.stringify(this.contentHeader));
      console.log("--------------------------------------------------------------------");

      this.http.get(this.urlData.VERIFICATION_URL + credentials["code"], { headers: this.contentHeader })
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
    //this.getCurrentUserPromise();
    
    this.currentUser["sms_verified"] = true;
    this.userData.setCurrentUser(this.currentUser).then(user => {
      this.getUserPermissions();
      this.nav.setRoot(TabsPage);
    }).catch(error => {
      console.log(error);
    });

    /*this.currentUser = this.userData.getCurrentUser();
    this.isLoggedIn = this.userData.isLoggedIn();
    this.isAuthorized = this.userData.isAuthorized('user');
    this.isAdmin = this.userData.isAdmin();*/

    //this.nav.setRoot(HomePage);
    //this.nav.setRoot(MyAccountPage);

  }

  logout() {
    this.userData.logout();
    this.contentHeader = new Headers({"Content-Type": "application/json"});
    //this.nav.setRoot(HomePage);
    this.nav.setRoot(TabsPage);
  }

  authSuccess(token) {
    alert("authSuccess");
    console.log("token---------------------------------------" + token);
    this.error = null;
    this.userData.setToken(token);
    this.contentHeader = new Headers({"Content-Type": "application/json"});
    this.contentHeader.append('Authorization', 'Bearer ' + token);

    console.log("contentHeader---------------------------------------" + JSON.stringify(this.contentHeader));
    this.http.get(this.urlData.ME_URL, { headers: this.contentHeader})
      .map(res => res.json())
      .subscribe(
        data => this.setCurrentUser(data),
        err => this.error = err
        //() => this.nav.setRoot(HomePage)
      );
  }

  setCurrentUser(data){
    alert("setCurrentUser");
    this.userData.setCurrentUser(data).then(isSet => {
      this.getUserPermissions();
      this.nav.setRoot(TabsPage);
    }).catch(error => {
      console.log(error);
    });

    /*this.currentUser = this.userData.getCurrentUser();
    this.isLoggedIn = this.userData.isLoggedIn();
    this.isAuthorized = this.userData.isAuthorized('user');
    this.isAdmin = this.userData.isAdmin();*/
  }


  printObject(object){
    let output = '';
    for (let property in object) {
      output += property + ': ' + object[property]+'; ';
    }
    console.log(output);
  }
}

