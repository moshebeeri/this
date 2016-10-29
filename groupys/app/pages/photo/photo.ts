import {Page, NavController, NavParams, Storage, LocalStorage, Modal, ViewController} from 'ionic-angular';
import {DeviceService} from '../../services/device/device';


@Page({
  templateUrl: 'build/pages/photo/photo.html',
  providers : [DeviceService]
})
export class PhotoPage {public base64Image: string; local: Storage = new Storage(LocalStorage);

  public base64Image:any;

  constructor(private viewCtrl: ViewController, public nav: NavController, private params: NavParams,  private deviceService: DeviceService) {
    this.nav = nav;
    //this.base64Image =  params.get("base64Image");
    this.local.get('photoModal').then(base64Image => {
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

