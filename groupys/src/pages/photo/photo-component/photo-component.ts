import {Component, Input} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Platform, NavController, Modal, ActionSheetController } from 'ionic-angular';
import {DeviceService} from '../../../services/device/device';
import {MyCameraService} from '../../../services/my-camera/my-camera';
import {PhotoService} from '../../photo/photo-service';

@Component({
  selector: 'photo-upload',
  template: '<img id="avatar" class="avatar" src="{{base64Image}}" (click)="pictureModal()"><button fab class="cameraButton" (click)="presentActionSheet()"><ion-icon name="camera" ></ion-icon></button>',
  styles: [`
    .profileImage { 
      font-size: 100px;
      color:white;
    }
    
    .avatarBG {
       margin-top: 50px;
       margin-left: auto;
       margin-right: auto;
       width: 110px;
       height: 110px;
       -webkit-border-radius: 50%;
       -moz-border-radius: 50%;
       border-radius: 50%;
       //background-color:#d8dfea;
     }
    .avatar {
      margin-top: 50px;
      width: 110px;
      height: 110px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
    
    }
    .cameraButton{
      margin-top: 120px;
      margin-left: -25px;
    }
  `],
	providers :[DeviceService, PhotoService, MyCameraService]

})
export class PhotoComponent{
  @Input() data;
	public base64Image: string;
	cameraDestinationType: any;
  local: any;
  entityType: string;
	
	constructor(public actionSheetCtrl: ActionSheetController, private storage: Storage, private deviceService: DeviceService, private photoService: PhotoService, private myCameraService: MyCameraService, public nav: NavController){

    this.actionSheetCtrl = actionSheetCtrl;
    this.local = storage;
		this.nav = nav;
		this.base64Image =  'img/avatar3.png';
		this.cameraDestinationType = this.deviceService.getCameraDestinationType();
		this.getBase64Image();
    this.entityType = this.data;
	}
	
	getBase64Image(){
    this.local.get('base64Image').then(base64Image => {
      //alert("IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //alert('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }

  pictureModal() {
    this.photoService.navigateToPhoto(this.base64Image);
    /*
     let pictureModal = Modal.create(PictureModal);
     this.nav.present(pictureModal);
     */
  }
	
  getGalleryPic(){
    //this.base64Image = this.myCameraService.getGalleryPic();
    //this.myCameraService.getGalleryPic().subscribe(data => this.setImage(data));
    this.myCameraService.getGalleryPic(this.entityType);
  }

  takePicture(){
    //this.base64Image = this.myCameraService.takePicture();
    //this.myCameraService.takePicture().subscribe(data => this.setImage(data));
    this.myCameraService.takePicture(this.entityType);
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
            this.base64Image =  'img/avatar3.png';
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
