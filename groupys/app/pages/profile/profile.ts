import {Page, NavController} from 'ionic-angular';
import {Camera} from 'ionic-native';


@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers : [Camera]
})
export class ProfilePage {
  public base64Image: string;
  
  constructor() {
    
  }
  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }
}
