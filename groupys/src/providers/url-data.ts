import {Injectable} from '@angular/core';

@Injectable()
export class UrlData {

  allPostURLS: Object;
  allPutURLS: Object;
  BASE_URL: string;
  LOGIN_URL: string;
  SIGNUP_URL: string;
  ME_URL: string;
  VERIFICATION_URL: string;
  METADATA_URL: string;
  PHONE_BOOK_URL: string;
  PHONE_NUMBER_URL: string;
  CHECK_PHONE_NUMBERS_URL: string;
  FILE_TRANSFER_URL: string;
  TEST_URL: string;
  GROUP_URL: string;
  GROUP_CONTACTS_URL: string;
  GROUP_LIST_URL: string;
  BUSINESS_URL: string;
  BUSINESS_CONTACTS_URL: string;
  BUSINESS_LIST_URL: string;
  PROMOTION_URL: string;
  PROMOTION_CONTACTS_URL: string;
  PROMOTION_LIST_URL: string;
  IP_URL: string;
  modified: any;

  constructor() {
    this.modified = "?" + (new Date).getTime();
    this.allPostURLS = [];
    this.allPutURLS = [];
    if (window.location.host.match("localhost")) {
      this.BASE_URL = "http://localhost:9000/api/";
    } else {
      //this.BASE_URL = "http://low.la:9000/api/";
      this.BASE_URL = "http://10.0.0.7:9000/api/";
    }
    this.LOGIN_URL = this.BASE_URL + "local";
    this.SIGNUP_URL = this.BASE_URL + "users";
    this.ME_URL = this.BASE_URL + "users/me" + this.modified;
    this.VERIFICATION_URL = this.BASE_URL + "users/verification/";
    this.METADATA_URL = this.BASE_URL + "breeze/metadata";
    //this.PHONE_BOOK_URL = this.BASE_URL + "users/phonebook";
    this.PHONE_BOOK_URL = this.BASE_URL + "phonebooks" + this.modified;
    this.PHONE_NUMBER_URL = this.BASE_URL + "users/phone_number" + this.modified;
    this.CHECK_PHONE_NUMBERS_URL = this.BASE_URL + "users/check_phone_numbers" + this.modified;
    this.FILE_TRANSFER_URL = this.BASE_URL + "images/";
    this.TEST_URL = this.BASE_URL + "tests/";
    this.GROUP_URL = this.BASE_URL + "groups/";
    this.BUSINESS_URL = this.BASE_URL + "businesses/";
    this.PROMOTION_URL = this.BASE_URL + "promotions/";
    // groups/add/users/:to_group
    this.GROUP_CONTACTS_URL = this.BASE_URL + "groups/add/users/";
    this.BUSINESS_CONTACTS_URL = this.BASE_URL + "businesses/add/users/";
    this.PROMOTION_CONTACTS_URL = this.BASE_URL + "promotions/add/users/";
    this.GROUP_LIST_URL = this.BASE_URL + "groups/following/user" + this.modified;
    this.BUSINESS_LIST_URL = this.BASE_URL + "businesses/following/user" + this.modified;
    this.PROMOTION_LIST_URL = this.BASE_URL + "promotions/following/user" + this.modified;
    this.IP_URL = this.BASE_URL + "ip" + this.modified;

    // used by formBuilder - get the post/put url automatically by entity name
    this.allPostURLS["Group"] = this.GROUP_URL;
    this.allPostURLS["Business"] = this.BUSINESS_URL;
    this.allPostURLS["Promotion"] = this.PROMOTION_URL;
    this.allPostURLS["Test"] = this.TEST_URL;
    this.allPutURLS["User"] = this.SIGNUP_URL;
}
  // used by formBuilder - get the post/put url automatically by entity name
  public getPostUrlByEntity(entity){
    if(this.allPostURLS[entity] != undefined && this.allPostURLS[entity].length > 0){
      return this.allPostURLS[entity];
    } else {
      return this.BASE_URL;
    }
  }
  // used by formBuilder - get the post/put url automatically by entity name
  public getPutUrlByEntity(entity){
    if(this.allPutURLS[entity] != undefined && this.allPutURLS[entity].length > 0){
      return this.allPutURLS[entity];
    } else {
      return this.BASE_URL;
    }
  }
}








