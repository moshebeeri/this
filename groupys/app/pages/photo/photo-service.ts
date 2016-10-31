import {Injectable} from '@angular/core';
import {Page, NavController, Storage, LocalStorage, Modal, ViewController} from 'ionic-angular';
import {DeviceService} from '../../services/device/device';
import {PhotoPage} from './photo';


@Injectable()
export class PhotoService {

  public base64Image: string;
  local: Storage = new Storage(LocalStorage);

  constructor(private viewCtrl: ViewController, public nav: NavController, private deviceService: DeviceService) {
    this.nav = nav;
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

      let photoPage = Modal.create(PhotoPage);
      this.nav.present(photoPage);

      /*this.nav.present(photoPage,{
        base64Image: this.base64Image
      });*/
    }
  }
}

