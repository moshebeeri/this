import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Camera} from 'ionic-native';
//import {NameModal} from './nameModal';
//import {MyAccountPage} from '../my-account';
import {DeviceService} from '../../../services/device/device';


@Component({
  templateUrl: 'pictureModal.html',
  providers : [Camera, DeviceService]
})
export class PictureModal {

  public base64Image: string;
  local: any;
  
	constructor(private storage: Storage,private viewCtrl: ViewController, public nav: NavController, private deviceService: DeviceService) {
    this.local = storage;
    this.nav = nav;
		this.base64Image =  'img/avatar3.png';
		this.getBase64Image();
	}
		
	close() {
		this.viewCtrl.dismiss();
	}
	/*
	getBase64Image(){
		this.local.get('base64Image').then(base64Image => {
			///if(JSON.parse(base64Image).length>-1){
			if(base64Image.length>-1){
				///this.base64Image = JSON.parse(base64Image);
				this.base64Image = base64Image;
				alert(this.base64Image);
			}
			//return this.base64Image;

		}).catch(error => {
			console.log(error);
		});
	}
	*/

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
}

