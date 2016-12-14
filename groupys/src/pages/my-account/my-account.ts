import { Component, NgModule } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
//import {ControlGroup, Control, ControlArray, FormBuilder} from '@angular/common';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
//import {ChangeDetectionStrategy} from '@angular/core';
import {Http} from '@angular/http';
import {EntitiesService} from '../../services/entities/entities-service';
import {FormBuilderService} from '../../services/form-builder/form-builder';
import {DebugPanelComponent} from '../../services/form-builder/debug-panel/debug-panel.component';
import {FormButtonsComponent} from '../../services/form-builder/form-buttons-component/form-buttons-component';
import {MyCameraService} from '../../services/my-camera/my-camera';
import {DeviceService} from '../../services/device/device';
import {PhotoComponent } from '../photo/photo-component/photo-component';

import {RegisterPage} from '../register/register';
//import {TimerWrapper} from 'angular2/src/facade/async';

/*@NgModule({
 //imports:      [ BrowserModule],
 declarations: [ DebugPanelComponent, PhotoComponent, FormButtonsComponent ],  //<----here
 //providers:    [],
 //bootstrap:    [ AppComponent ]
 })*/

@Component({
  templateUrl: 'my-account.html',
  providers : [EntitiesService, FormBuilderService, MyCameraService, DeviceService],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  //directives: [DebugPanelComponent, PhotoComponent, FormButtonsComponent]
})
export class MyAccountPage {
  entityForm: FormGroup;
  //controlArray: ControlArray;
  bodyHTML: String;
  theHtmlString: String;
  formActive = true;
  photoData: string;
  formID: string;
  local:any;
  currentUser:any;

  entities: Array<string>;

  constructor(private storage: Storage, private nav:NavController, private navParams:NavParams, private entitiesService:EntitiesService, private formBuilderService:FormBuilderService) {
    this.nav = nav;
    this.photoData = "User";
    this.formID = this.unixID();
    this.local = storage;

    this.entitiesService = entitiesService;
    this.formBuilderService = formBuilderService;
    this.entities = [];

    this.theHtmlString = '<div>GROUPYS APP</div>';

  }

  ngOnInit() {
    let isUpload = false;
    let httpMethod = 'PUT';

    this.formBuilderService.buildFormByEntity('User').subscribe(
      data => this.entityForm = data
    );
    this.formBuilderService.buildHTMLByEntity('User',this.formID, isUpload ,httpMethod, [],[],[]).subscribe(
      data => this.bodyHTML = data
    );
    //this.controlArray = this.entityForm.find('controlArrayField') as ControlArray;
    console.log(this.bodyHTML);


  }
  onSubmitForm() {
    console.log(this.entityForm.value);
    //this.entityForm.value.creator = 999999;
    this.formBuilderService.onSubmitForm(this.entityForm);
  }
  onClearForm() {
    /*this.formBuilderService.buildFormByEntity('Group').subscribe(
     data => this.entityForm = data
     );
     this.formActive = false;
     setTimeout(() => {
     this.formActive = true;
     }, 0);*/
    //console.log("reset: " + this.entityForm);
    this.entityForm.reset();
  }

  onAddArrayRequest(controlArray) {
    this.formBuilderService.onAddArrayRequest(controlArray);
  }

  onRemoveArrayRequest(controlArray, index) {
    this.formBuilderService.onRemoveArrayRequest(controlArray, index);
  }
  unixID() {
    let d = new Date();
    let n = d.getTime();
    return n.toString();
  }

  getCurrentUser() {
    //alert("getCurrentUser");
    this.local.get('user').then(user => {
      this.currentUser = JSON.parse(user);
      //this.entityForm.value["phone_number"] = this.currentUser["phone_number"];
    }).catch(error => {
      console.log(error);
    });
  }


}
