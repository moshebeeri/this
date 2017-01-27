import { Component, NgModule } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';



@Component({
  selector: 'page-campaign-contact',  
  templateUrl: 'campaign-contact.html'
})
export class CampaignContactPage {
  data:string;
  formID:string;
  pageType:string;
  entityType:string;
  businessID:string;

  
  constructor(private navParams: NavParams) {
    this.data = "data";
    this.formID = "formID";
    //this.pageType = "page";
    this.pageType = "wizard";
    this.entityType = "Campaign";
    this.businessID = this.navParams.get('businessID');
  }


}
