import {Page, NavController, Storage, LocalStorage, Modal, ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {NameModal} from './nameModal';


@Page({
  templateUrl: 'build/pages/my-account/modals/pictureModal.html',
  providers : [Camera]
})
export class PictureModal {
  public base64Image: string;
  
	constructor(
		private viewCtrl: ViewController,
		public nav: NavController) {
		this.nav = nav;
	}
		
	close() {
		this.viewCtrl.dismiss();
	}
		
	takePicture(){
		Camera.getPicture({
			destinationType: Camera.DestinationType.DATA_URL,
			targetWidth: 1000,
			targetHeight: 1000
		}).then((imageData) => {
		  // imageData is a base64 encoded string
			this.base64Image = "data:image/jpeg;base64," + imageData;
			let nameModal = Modal.create(NameModal);
			this.nav.present(nameModal);
		}, (err) => {
			console.log(err);
		});
	}
}

