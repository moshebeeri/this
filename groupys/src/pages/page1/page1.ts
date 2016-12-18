import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  local: any;
  todo: any;

  constructor(private storage: Storage, public navCtrl: NavController) {
    this.local = storage;
    this.resetLocalStorage();
    this.todo = {};
  }
  
  logForm() {
    console.log(this.todo)
  }
  resetLocalStorage(){
    alert("remove all data");
    this.local.clear();
  }

}
