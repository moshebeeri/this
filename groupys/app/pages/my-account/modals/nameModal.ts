import {Page, NavController, Storage, LocalStorage, Modal, ViewController} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/my-account/modals/nameModal.html',
})
export class NameModal {
	constructor(
		private viewCtrl: ViewController) {}
		
	close() {
		this.viewCtrl.dismiss();
	}

}
