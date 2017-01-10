import { Component, Input, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController, Modal, ActionSheetController } from 'ionic-angular';
import { DeviceData } from '../../../providers/device-data';
import { CameraData } from '../../../providers/camera-data';
import { PhotoService} from '../../photo/photo-service';

@Component({
  selector: 'photo-upload',
  templateUrl: 'photo-component.html',
  providers :[DeviceData, PhotoService, CameraData]

})
export class PhotoComponent{
  @Input() data;
  @Input() formID;
  @Input() isUpload;
  public base64Image: string;
  cameraDestinationType: any;
  local: any;
  entityType: string;
  serviceName: string;

  constructor(private ngZone: NgZone, public actionSheetCtrl: ActionSheetController, private storage: Storage, private deviceService: DeviceData, private photoService: PhotoService, private cameraData: CameraData, public nav: NavController){
    this.serviceName = "PhotoComponent ======";
    this.actionSheetCtrl = actionSheetCtrl;
    this.local = storage;
    this.nav = nav;
    this.base64Image =  'assets/img/avatar3.png';
    this.cameraDestinationType = this.deviceService.getCameraDestinationType();
    this.getBase64Image();
    this.entityType = this.data;
  }


  getBase64Image(){
    this.local.get('base64Image').then(base64Image => {
      //console.log("IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //console.log('base64Image: ' + this.base64Image);
      } else {
        this.base64Image =  'assets/img/avatar3.png';
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }

  pictureModal() {
    console.log(this.serviceName + "this.data: " + this.data);
    console.log(this.serviceName + "this.formID: " + this.formID);
    console.log(this.serviceName + "this.isUpload: " + this.isUpload);
    console.log(this.serviceName + "this.entityType: " + this.entityType);
    this.photoService.navigateToPhoto(this.base64Image);
    /*
     let pictureModal = Modal.create(PictureModal);
     this.nav.present(pictureModal);
     */
  }

  getGalleryPic(){
    //this.base64Image = this.cameraData.getGalleryPic();
    //this.cameraData.getGalleryPic().subscribe(data => this.setImage(data));
    console.log(this.serviceName + "this.entityType: " + this.entityType);
    console.log(this.serviceName + "this.formID: " + this.formID);
    console.log(this.serviceName + "this.isUpload: " + this.isUpload);
    this.cameraData.getGalleryPic(this.entityType, this.formID, this.isUpload, (response) => {
      this.ngZone.run(() => {
        alert(response);
        this.base64Image = response;
      });
    });
  }

  takePicture(){
    //this.base64Image = this.cameraData.takePicture();
    //this.cameraData.takePicture().subscribe(data => this.setImage(data));
    this.cameraData.takePicture(this.entityType, this.formID, this.isUpload, (response) => {
      this.ngZone.run(() => {
        alert(response);
        this.base64Image = response;
      });
    });
  }

  // your data handler
  handleData( data ) {
    // do whatever
    alert(data);
    return data;

  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Profile Photo',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            console.log(this.serviceName + 'Gallery clicked');
            this.getGalleryPic();
          }
        },{
          text: 'Camera',
          handler: () => {
            console.log(this.serviceName + 'Camera clicked');
            this.takePicture();
          }
        },{
          text: 'Remove Photo',
          handler: () => {
            console.log(this.serviceName + 'Remove Photo clicked');
            this.base64Image =  'assets/img/avatar3.png';
            this.local.remove('base64Image');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log(this.serviceName + 'Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
