import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, Modal, ViewController} from 'ionic-angular';
import { DeviceData } from '../../providers/device-data';


@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {

  public base64Image: string;
  local: any;

  //public base64Image:any;

  constructor(private storage: Storage, private viewCtrl: ViewController, public nav: NavController,  private deviceService: DeviceData) {
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

