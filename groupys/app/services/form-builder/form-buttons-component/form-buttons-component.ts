import {Component, Input} from '@angular/core';
import {Platform, Page, NavController, Modal, Storage, LocalStorage, ActionSheet} from 'ionic-angular';
import {FormBuilderService} from '../form-builder';


@Component({
  selector: 'form-buttons',
  template: '<div padding></div><button type="submit">Submit</button><button type="button" (click)="onClearForm()">Reset</button>',
	providers : [FormBuilderService]

})
export class FormButtonsComponent{
  @Input() data;
  myForm: any;
  formActive: any;
	
	constructor(private formBuilderService:FormBuilderService){
		console.log(this.data);
		this.formBuilderService = formBuilderService;
	}
	ngOnInit() {
    this.myForm = (this.data);
		console.log(this.data);
  }
	onClearForm() {
    /*this.formBuilderService.buildFormByEntity('Group').subscribe(
      data => this.entityForm = data
    );
    this.formActive = false;
    setTimeout(() => {
      this.formActive = true;
    }, 0);*/
		this.myForm.reset();
  }

}
