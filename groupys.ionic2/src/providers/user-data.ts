import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  serviceName: string;

  constructor(public events: Events, public storage: Storage) {
    this.serviceName = "UserData ======";
  }

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout() {
    console.log(this.serviceName + "logout");
    this.storage.remove('token');
    this.storage.remove('user');

    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };


  authenticated() {
    return tokenNotExpired();
    //return true;
  }
  isAdmin() {
    return this.storage.get('user').then(user => {
      let currentUser = JSON.parse(user);
      return !!currentUser && currentUser["role"] === 'admin';
    }).catch(error => {
      console.log(error);
    });
  }

  isAuthorized(role) {
    return this.storage.get('user').then(user => {
      let currentUser = JSON.parse(user);
      return !!currentUser && currentUser["role"].indexOf(role) > -1;
    }).catch(error => {
      console.log(error);
    });
  }

  isLoggedIn() {
    return this.storage.get('user').then(user => {
      let currentUser = JSON.parse(user);
      return !!currentUser && currentUser["sms_verified"] === true;
    }).catch(error => {
      console.log(error);
    });
  }

  getCurrentUser() {
    return this.storage.get('user').then(user => {
      return JSON.parse(user);
    }).catch(error => {
      console.log(error);
    });
  }
  setCurrentUser(user) {
    console.log(this.serviceName + "user: " + JSON.stringify(user));
    this.login(user["phone_number"]);
    return this.storage.set('user', JSON.stringify(user)).then(user => {
      return true;
    }).catch(error => {
      console.log(error);
    });

  }

  getToken() {
    return this.storage.get('token').then(token => {
      return token;
    }).catch(error => {
      console.log(error);
    });
  }
  setToken(token) {
    console.log(this.serviceName + "setToken: " + token);
    this.storage.set('token', token);
  }
}
