import {Injectable} from '@angular/core';

@Injectable()
export class GlobalsService {

  allURLS: Object;
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

  constructor() {
    this.allURLS = [];
    if (window.location.host.match("localhost")) {
      this.BASE_URL = "http://localhost:9000/api/";
    } else {
      //this.BASE_URL = "http://low.la:9000/api/";
      this.BASE_URL = "http://www-pc:9000/api/";
    }
    this.LOGIN_URL = this.BASE_URL + "local";
    this.SIGNUP_URL = this.BASE_URL + "users";
    this.ME_URL = this.BASE_URL + "users/me";
    this.VERIFICATION_URL = this.BASE_URL + "users/verification/";
    this.METADATA_URL = this.BASE_URL + "breeze/metadata";
    //this.PHONE_BOOK_URL = this.BASE_URL + "users/phonebook";
    this.PHONE_BOOK_URL = this.BASE_URL + "phonebooks";
    this.PHONE_NUMBER_URL = this.BASE_URL + "users/phone_number/";
    this.CHECK_PHONE_NUMBERS_URL = this.BASE_URL + "users/check_phone_numbers";
    this.FILE_TRANSFER_URL = this.BASE_URL + "images/";
    this.TEST_URL = this.BASE_URL + "tests/";
    this.GROUP_URL = this.BASE_URL + "groups/";

    this.allURLS["Group"] = this.GROUP_URL;
    this.allURLS["Test"] = this.TEST_URL;
}

  public getPostUrlByEntity(entity){
    if(this.allURLS[entity] != undefined && this.allURLS[entity].length > 0){
      return this.allURLS[entity];
    } else {
      return this.BASE_URL;
    }
  }
}








