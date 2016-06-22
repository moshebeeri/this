import {Page, NavController, Modal} from 'ionic-angular';
import {ProfilePage} from '../profile/profile';
import {NameModal} from './modals/nameModal';
import {PictureModal} from './modals/pictureModal';

/*
  Generated class for the MyAccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/my-account/my-account.html',
})
export class MyAccountPage {
  constructor(public nav: NavController) {
	this.nav = nav;
  }
  updatePic(){
    console.log("updatePic");
    this.nav.push(ProfilePage);
  }
  nameModal() {
    let nameModal = Modal.create(NameModal);
    this.nav.present(nameModal);
  }
  pictureModal() {
    let pictureModal = Modal.create(PictureModal);
    this.nav.present(pictureModal);
  }
}
