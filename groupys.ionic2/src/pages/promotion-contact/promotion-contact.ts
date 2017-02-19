import { Component, NgModule } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-promotion-contact',  
  templateUrl: 'promotion-contact.html'
})
export class PromotionContactPage {
  data:string;
  formID:string;
  pageType:string;
  entityType:string;

  constructor() {
    this.data = "data";
    this.formID = "formID";
    //this.pageType = "page";
    this.pageType = "wizard";
    this.entityType = "Promotion";
  }


}
