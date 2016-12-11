import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  //local: Storage = new Storage(LocalStorage);
  local:any;
  
  constructor(storage: Storage) {
    this.local = storage;
  }
  
  authenticated() {
    return tokenNotExpired();
    //return true;
  }
  isAdmin() {
    this.local.get('user').then(user => {
      let currentUser = user;
      //alert("currentUser: " + currentUser);
      //let result =  !!currentUser && currentUser["role"] === 'admin';
      //alert("result: " + result);
      return false;
    }).catch(error => {
      console.log(error);
    });
  }
  isAuthorized(role) {
    return Observable.create(observer => {
      observer.next(this.isAuthorizedPromise(role));
      observer.complete();
    });
  }
  isAuthorizedPromise(role) {
    this.local.get('user').then(user => {
      let currentUser = JSON.parse(user);
      //alert("isAuthorized: " + JSON.stringify(currentUser));
      //alert("isAuthorized: " + currentUser["role"].indexOf(role));
      if(currentUser["role"].indexOf(role) > -1){
        return true;
      } else {
        return false;
      }
    }).catch(error => {
      console.log(error);
    });
  }
  isAuthorized2(role) {
    this.local.get('user').then(user => {
      let currentUser = user;
      //alert("currentUser: " + currentUser);
      //let result =  !!currentUser && currentUser["role"] && currentUser["role"].indexOf(role) > -1;
      //alert("result: " + result);
      return false;
    }).catch(error => {
      console.log(error);
    });
  }
  isLoggedIn() {
    this.local.get('user').then(user => {
      let currentUser = user;
      //alert("currentUser: " + currentUser);
      //return !!currentUser && currentUser.hasOwnProperty('role');
      //let result = !!currentUser && currentUser["sms_verified"] === true;
      //alert("result: " + result);
      return false;
    }).catch(error => {
      console.log(error);
    });
  }
  getCurrentUser() {
    //alert("getCurrentUser");
    this.local.get('user').then(user => {
      //alert(JSON.stringify(user));
      return JSON.parse(user);
    }).catch(error => {
      console.log(error);
    });
  }
  setCurrentUser(user) {
    //alert("setCurrentUser");
    this.local.set('user', JSON.stringify(user));
  }
  getToken() {
    this.local.get('token').then(token => {
      //alert(JSON.stringify(token));
      return token;
    }).catch(error => {
      console.log(error);
    });
  }
  setToken(token) {
    this.local.set('token', token);
  }
  logout() {
    this.local.remove('token');
    this.local.remove('user');
  }

}