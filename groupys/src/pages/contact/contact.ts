import { Component, NgModule } from '@angular/core';
import {NavController} from 'ionic-angular';


@Component({
  selector: 'contact-page',
  templateUrl: 'contact.html'
})
export class ContactPage {

  data:string;
  formID:string;
  pageType:string;

  constructor() {
    this.data = "data";
    this.formID = "formID";
    this.pageType = "page";
    //this.pageType = "wizard";
  }


}
