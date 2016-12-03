import { Component, NgModule } from '@angular/core';
import {Platform, NavController, ModalController, ActionSheetController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import {ProfilePage} from '../profile/profile';
import {PhotoService} from '../photo/photo-service';
import {NameModal} from './modals/nameModal';
import {PictureModal} from './modals/pictureModal';
import {Camera, Transfer} from 'ionic-native';
import {DeviceService} from '../../services/device/device';
import {MyCameraService} from '../../services/my-camera/my-camera';
import {GlobalsService} from '../../services/globals/globals';
import {GlobalHeaders} from '../../services/headers/headers';
import {NgZone} from '@angular/core';

/*
  Generated class for the MyAccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'my-account.html'
})

export class MyAccountPage {

  public base64Image: string;
  //public base64Image2: string;
  public imageLocalStorage: string;
  public filePath: string;

  cameraDestinationType: any;

  local: any;
  contentHeader: Headers = new Headers();


  uploading: boolean = true;
  current: number = 1;
  total: number;
  progress: number;

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private platform: Platform,
    private deviceService: DeviceService,
    private myCameraService: MyCameraService,
    private photoService: PhotoService,
    private globals: GlobalsService,
    private globalHeaders:GlobalHeaders,
    private ngZone: NgZone
  ){
    this.navCtrl = navCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.local = storage;
    this.modalCtrl = modalCtrl;
    this.globals = globals;
    this.platform = platform;
    this.globalHeaders = globalHeaders;

    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();

    this.base64Image =  'assets/img/avatar3.png';
    this.local.set('base64Image',this.base64Image);
    this.getBase64Image();
    this.cameraDestinationType = this.deviceService.getCameraDestinationType();
    this.local.set('filePath','');
    //alert(this.cameraDestinationType);
  }
  updatePic(){
    console.log("updatePic");
    //this.navCtrl.push(ProfilePage);
  }
  nameModal() {
    let nameModal = this.modalCtrl.create(NameModal);
    //shidrog
    //this.nav.present(nameModal);
    nameModal.present();
  }
  pictureModal() {
    this.photoService.navigateToPhoto(this.base64Image);
    /*
     let pictureModal = this.modalCtrl.create(PictureModal);
     pictureModal.present();
     */
  }


  getBase64Image(){
    this.local.get('base64Image').then(base64Image => {
      //alert(base64Image);
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //alert('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }

  getGalleryPic(){
    //this.base64Image = this.myCameraService.getGalleryPic();
    //this.myCameraService.getGalleryPic().subscribe(data => this.setImage(data));
    this.myCameraService.getGalleryPic(MyAccountPage);
  }

  takePicture(){
    //this.base64Image = this.myCameraService.takePicture();
    //this.myCameraService.takePicture().subscribe(data => this.setImage(data));
    this.myCameraService.takePicture(MyAccountPage);
  }

  setImage(data){
    this.navCtrl.push(MyAccountPage);
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Profile Photo',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery clicked');
            this.getGalleryPic();
          }
        },{
          text: 'Camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePicture();
          }
        },{
          text: 'Remove Photo',
          handler: () => {
            console.log('Remove Photo clicked');
            this.base64Image =  'assets/img/avatar3.png';
            this.local.remove('base64Image');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
