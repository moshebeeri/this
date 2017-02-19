import { Component, NgModule } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
//import {ChangeDetectionStrategy} from '@angular/core';
import {Http} from '@angular/http';

import { EntityData} from '../../providers/entity-data/entity-data';
import { FormBuilderService } from '../../components/form-builder/form-builder';
import { DebugPanelComponent } from '../../components/form-builder/debug-panel/debug-panel.component';
import { FormButtonsComponent } from '../../components/form-builder/form-buttons-component/form-buttons-component';
import { CameraData } from '../../providers/camera-data';
import { DeviceData } from '../../providers/device-data';
import { PhotoComponent } from '../../components/photo/photo-component/photo-component';

//import {TimerWrapper} from 'angular2/src/facade/async';

/*@NgModule({
 //imports:      [ BrowserModule],
 declarations: [ DebugPanelComponent, PhotoComponent, FormButtonsComponent ],  //<----here
 //providers:    [],
 //bootstrap:    [ AppComponent ]
 })*/

@Component({
  selector: 'page-promotion',
  templateUrl: 'promotion.html'
})
export class PromotionPage {
  entityForm: FormGroup;
  //controlArray: ControlArray;
  bodyHTML: String;
  theHtmlString: String;
  formActive = true;
  photoData: string;
  formID: string;
  entities: Array<string>;
  serviceName:string;
  groupID:string;

  constructor(private params:NavParams, private nav:NavController, private entitiesService:EntityData, private formBuilderService:FormBuilderService) {
    this.serviceName = "PromotionPage ======";
    this.photoData = "Promotion";

    this.formID = this.params.get("formID") || "notDefined";
    this.groupID = this.params.get("groupID");
    console.log(this.serviceName + "formID: "+ this.formID);
    if(this.formID === "notDefined"){
      this.formID = this.unixID();
    }


    this.entitiesService = entitiesService;
    this.formBuilderService = formBuilderService;
    this.entities = [];

    this.theHtmlString = '<div>GROUPYS APP</div>';

  }

  ngOnInit() {
    let isUpload = false;
    let httpMethod = 'POST';

    this.formBuilderService.buildFormByEntity('Promotion').subscribe(
      data => this.entityForm = data
    );
    this.formBuilderService.buildHTMLByEntity('Promotion', this.formID ,isUpload ,httpMethod , [],[],[]).subscribe(
      data => this.bodyHTML = data
    );
    //this.controlArray = this.entityForm.find('controlArrayField') as ControlArray;
    console.log(this.serviceName + "bodyHTML: " + this.bodyHTML);
    console.log("=========================================================");
    console.log(JSON.stringify(this.entityForm.value));
    console.log("=========================================================");

  }
  onSubmitForm() {
    this.entityForm.value["business"] = this.groupID;
    console.log(this.serviceName + "entityForm: " + this.entityForm.value);
    //this.entityForm.value.creator = 999999;
    console.log("onSubmitForm: " + this.entityForm);
    this.formBuilderService.onSubmitForm(this.entityForm);
    //this.nav.setRoot(TabsPage);
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

}
