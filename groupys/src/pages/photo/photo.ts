import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController, NavParams, Modal, ViewController} from 'ionic-angular';
import {DeviceService} from '../../services/device/device';


@Component({
  templateUrl: 'photo.html',
  providers : [DeviceService]
})
export class PhotoPage {

  public base64Image: string;
  local: any;

  //public base64Image:any;

  constructor(private storage: Storage, private viewCtrl: ViewController, public nav: NavController, private params: NavParams,  private deviceService: DeviceService) {
    this.local = storage;
    this.nav = nav;
    //this.base64Image =  params.get("base64Image");
    this.local.get('base64Image').then(base64Image => {
      this.base64Image = base64Image;
    }).catch(error => {
      console.log(error);
    });
    console.log("photoPage--photoPage--photoPage--photoPage--photoPage--photoPage--");
    console.log(this.base64Image);
    console.log("photoPage--photoPage--photoPage--photoPage--photoPage--photoPage--");
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

