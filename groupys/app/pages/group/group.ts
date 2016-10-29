import {Page, NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {ControlGroup, Control, ControlArray, FormBuilder} from '@angular/common';
import {Http} from '@angular/http';
import {EntitiesService} from '../../services/entities/entities-service';
import {FormBuilderService} from '../../services/form-builder/form-builder';
import {DebugPanelComponent} from '../../services/form-builder/debug-panel/debug-panel.component';
import {MyCameraService} from '../../services/my-camera/my-camera';
import {DeviceService} from '../../services/device/device';
import {RegisterPage} from '../register/register';
//import {TimerWrapper} from 'angular2/src/facade/async';



@Page({
  templateUrl: 'build/pages/group/group.html',
  providers : [EntitiesService, FormBuilderService, MyCameraService, DeviceService],
  directives: [DebugPanelComponent]
})
export class GroupPage {
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
    this.formBuilderService.buildFormByEntity('Test').subscribe(
      data => this.entityForm = data
    );
    this.formBuilderService.buildHTMLByEntity('Test',[],[],[]).subscribe(
      data => this.bodyHTML = data
    );
		//this.controlArray = this.entityForm.find('controlArrayField') as ControlArray;
		
    console.log(this.bodyHTML);
  }
  onSubmitForm() {
    //console.log(this.entityForm.value);
		this.formBuilderService.onSubmitForm(this.entityForm);
  }
	onClearForm(formActiveFlag) {
		//this.formBuilderService.onClearForm(this.entityForm, formActiveFlag);
  }
	
	onAddArrayRequest(controlArray) {
    this.formBuilderService.onAddArrayRequest(controlArray);
  }
  
  onRemoveArrayRequest(controlArray, index) {
		this.formBuilderService.onRemoveArrayRequest(controlArray, index);
  }

}
