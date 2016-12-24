import { Component, NgModule } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';



@Component({
  selector: 'group-contact',  
  templateUrl: 'group-contact.html'
})
export class GroupContactPage {
  data:string;
  formID:string;
  pageType:string;

  constructor() {
    this.data = "data";
    this.formID = "formID";
    //this.pageType = "page";
    this.pageType = "wizard";
  }


}
