import { Component, NgModule } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-business-contact',  
  templateUrl: 'business-contact.html'
})
export class BusinessContactPage {
  data:string;
  formID:string;
  pageType:string;
  entityType:string;

  constructor() {
    this.data = "data";
    this.formID = "formID";
    //this.pageType = "page";
    this.pageType = "wizard";
    this.entityType = "Business";
  }


}
