import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';


@Component({
  templateUrl: 'nameModal.html',
})
export class NameModal {
	constructor(
		private viewCtrl: ViewController) {}
		
	close() {
		this.viewCtrl.dismiss();
	}

}
