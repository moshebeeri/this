import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  local: any;

  constructor(private storage: Storage, public navCtrl: NavController) {
    this.local = storage;
    this.resetLocalStorage();
  }
  resetLocalStorage(){
    alert("remove all data");
    this.local.clear();
  }

}
