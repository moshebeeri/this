import {Injectable} from 'angular2/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class AuthService {

  local: Storage = new Storage(LocalStorage);
  
  constructor() {}
  
  authenticated() {
    return tokenNotExpired();
  }
  isAdmin() {
    let currentUser = this.getCurrentUser();
    return !!currentUser && currentUser.role === 'admin';
  }
  isAuthorized(role) {
    let currentUser = this.getCurrentUser();
    return !!currentUser && currentUser.role.indexOf(role) > -1;
  }
  isLoggedIn() {
     let currentUser = this.getCurrentUser();
     return !!currentUser && currentUser.hasOwnProperty('role');
  }
  getCurrentUser() {
    let user = this.local.get('user');
	console.log("getUser: " + JSON.parse(user.__zone_symbol__value));
	return JSON.parse(user.__zone_symbol__value); 
  }
  setCurrentUser(user) {
    this.local.set('user', JSON.stringify(user));
  }
  getToken() {
    let token = this.local.get('token');
	return token.__zone_symbol__value;
  }
  setToken(token) {
    this.local.set('token', token);
  }
  logout() {
    this.local.remove('token');
    this.local.remove('user');
  }

}