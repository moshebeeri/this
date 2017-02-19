import { Injectable, Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { DeviceData } from '../../providers/device-data';
import { PhotoPage } from './photo';
import { Storage } from '@ionic/storage';



@Injectable()
export class PhotoService {

  public base64Image: string;
  local: any;

  constructor(public modalCtrl: ModalController,private storage: Storage, private deviceService: DeviceData) {
    this.local = storage;
    this.modalCtrl = modalCtrl;
    this.base64Image =  'img/loading.gif';
  }

  public navigateToPhoto(photo){


    if(this.deviceService.getImageLocalStorage(photo).length>-1){
      this.base64Image = this.deviceService.getImageLocalStorage(photo);
      this.local.remove('photoModal');
      this.local.set('photoModal',this.base64Image);

      console.log("photoService--photoService--photoService--photoService");
      console.log(this.base64Image);
      console.log("photoService--photoService--photoService--photoService");

      let photoPage = this.modalCtrl.create(PhotoPage);
      photoPage.present();

      /*this.nav.present(photoPage,{
        base64Image: this.base64Image
      });*/
    }
  }
}

