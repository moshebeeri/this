import {Page, NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {ControlGroup, Control, ControlArray, FormBuilder} from '@angular/common';
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



@Page({
  templateUrl: 'build/pages/test/test.html',
  providers : [EntitiesService, FormBuilderService, MyCameraService, DeviceService],
	//changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [DebugPanelComponent, PhotoComponent, FormButtonsComponent]
})
export class TestPage {
  entityForm: ControlGroup;
  //controlArray: ControlArray;
  bodyHTML: String;
  theHtmlString: String;
	formActive = true;

  entities: Array;

  constructor(private nav:NavController, private navParams:NavParams, private entitiesService:EntitiesService, private formBuilderService:FormBuilderService) {
    this.nav = nav;
    this.entitiesService = entitiesService;
    this.formBuilderService = formBuilderService;
    this.entities = [];
		this.theHtmlString = '<div>ramiraz</div>';
		
  }

  ngOnInit() {
    this.formBuilderService.buildFormByEntity('Group').subscribe(
      data => this.entityForm = data
    );
    this.formBuilderService.buildHTMLByEntity('Group',[],[],[]).subscribe(
      data => this.bodyHTML = data
    );
		//this.controlArray = this.entityForm.find('controlArrayField') as ControlArray;
		
    console.log(this.bodyHTML);
  }
  onSubmitForm() {
    //console.log(this.entityForm.value);
    //this.entityForm.value.creator = 999999;
		this.formBuilderService.onSubmitForm(this.entityForm);
  }
	onClearForm() {
    this.formBuilderService.buildFormByEntity('Group').subscribe(
      data => this.entityForm = data
    );
    this.formActive = false;
    setTimeout(() => {
      this.formActive = true;
    }, 0);
  }
	
	onAddArrayRequest(controlArray) {
    this.formBuilderService.onAddArrayRequest(controlArray);
  }
  
  onRemoveArrayRequest(controlArray, index) {
		this.formBuilderService.onRemoveArrayRequest(controlArray, index);
  }

}
