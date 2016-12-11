import * as _ from 'lodash';
//import {NavController, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
//import {FormGroup, FormControl, FormArray, /*RadioButtonState,*/ FormBuilder, Validators} from '@angular/forms';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {Http, Headers} from '@angular/http';
import {GlobalHeaders} from '../headers/headers';
import {GlobalsService} from '../globals/globals';
//import {ENTITIES} from '../entities/entities-data';
import {EntitiesService} from '../entities/entities-service';
import {AuthService} from '../auth/auth';
import {MyCameraService} from '../my-camera/my-camera';
import {Observable} from 'rxjs/Observable';

//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class FormBuilderService {

  error: string;
  entities: Array<string>;
  entityForm: FormGroup;
  controlArray: FormArray;
  defaultHTML: Object;
  excludedFields: Array<string>;
  excludedFieldsHTML: Array<string>;
  currentUser: any;
  local: any;
  contentHeader: Headers = new Headers();
  entityType: string;
  formID: string;
  //photoData: string;
  //photoFormID: string;



  constructor(private storage: Storage, private entitiesService:EntitiesService,private myCameraService: MyCameraService, private _formBuilder: FormBuilder, private auth:AuthService, private globalHeaders:GlobalHeaders, private globals:GlobalsService, private http:Http) {
    this.local = storage;
    this.entitiesService = entitiesService;
    this.myCameraService = myCameraService;
    this.auth = auth;
    this.globalHeaders = globalHeaders;
    this.globals = globals;
    this.http = http;
    this.currentUser ={};
    this.formID = '';
    //this.photoData = "Group";
    //this.photoFormID = "Group";

    //this.currentUser = this.auth.getCurrentUser();
    this.local.get('user').then(user => {
      this.currentUser = JSON.parse(user);
    }).catch(error => {
      console.log(error);
    });

    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(this.contentHeader));
    this.error = null;

    this.entities = [];
    this.defaultHTML = {
      input: '',
      radioButton: '',
      select: '',
      checkBox:'',
      label: '',
      option: ''
    };
		this.excludedFields = ["gid","created","timestamp", "id", "sms_code", "sms_verified", "role", "hashedPassword","provider","salt"];
		this.excludedFieldsHTML = ["gid","created","timestamp","id", "sms_code", "sms_verified", "role", "hashedPassword","provider","salt", "phone_number"];
    //this.weiredRequestNames = [];
    this._buildForm();


  }
  private _buildForm(){
    this.entityForm = this._formBuilder.group({});
  }

  public buildFormByEntity(entity){
    return Observable.create(observer => {
      observer.next(this._searchEntities(entity));
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log(this.entities["dataProperties"]);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      observer.next(this._generateFormStructure(this.entities["shortName"], this.entities["dataProperties"], this.entities["navigationProperties"]));
      observer.complete();
    });
  }
	/*
	public onClearForm(myform, flag) {
    myform = this._formBuilder.group({});
    flag = false;
    setTimeout(() => {
      flag = true;
    }, 0);
  }*/
	
	public onAddArrayRequest(arrayControl) {
    //this.weirdRequestsControls.push(this._formBuilder.control(null));
		arrayControl.push(this._formBuilder.control(null));
  }
  
  public onRemoveArrayRequest(arrayControl, index) {
    //this.weirdRequestsControls.removeAt(index);
		arrayControl.push(this._formBuilder.control(null));
  }

  private _searchEntities(entity){
    this.entitiesService.findByName(entity).subscribe(
      data => this.entities = data[0]
    );
  }
  
  private _generateFormStructure(entityType, properties, navigationProperties){

/*
    var arr = [];
    var obj = {};

    console.log(arr.constructor.prototype.hasOwnProperty('push'));//true
    console.log(obj.constructor.prototype.hasOwnProperty('push'));// false
    
    let x = this.controlArray;
    console.log(x);

    this.entitiesService.printSomething("cool");
    */

    let structureObject = {};
    let propertyArray = [];
    let controlValidators = [];
    this.entityType = entityType;

    //inject the post url for submit
    structureObject["postURL"] = this._formBuilder.control(entityType);
		
    for(let propt in properties) {
      //console.log(propt);//logs name
      //console.log(properties[propt]["defaultValue"]);//logs "Simon"
			if(this.excludedFields.indexOf(properties[propt]["name"]) === -1){
				if(properties[propt]["defaultValue"] === undefined){
					properties[propt]["defaultValue"] = '';
				}
				//"validators":[{"name":"required"
				/*console.log('########################################################');
				console.log(JSON.stringify(properties[propt]["validators"]));
				console.log('########################################################');
				if(properties[propt]["validators"] != undefined){
					let obj = _.find((properties[propt]["validators"]), function(obj) { return obj.name == 'required' });
					console.log(obj['name']);
				}*/
				if(properties[propt]["validators"] != undefined){
					controlValidators = this._getControlValidators(properties[propt]);
					
					console.log('########################################################');
					console.log(properties[propt]);
					console.log(controlValidators);
					console.log('########################################################');
				}
				
				

				structureObject[properties[propt]["name"]] = this._setFormControls(properties[propt], controlValidators);
				console.log(structureObject[properties[propt]["name"]]);
				}



      propertyArray = [];
    }

    //propertyArray[0] = this.setDefaultValue(property.defaultValue);
    //structureObject[property.name] = propertyArray;

    console.log("-------------------");
    //console.log(structureObject);
    console.log(this._formBuilder.group(structureObject));

    return this._formBuilder.group(structureObject);
  }
	private _getControlValidators(prop){
		
		//Validators.compose([Validators.required, Validators.minLength(2)])
		

		let allValidators = [];
		
		let obj = _.find((prop["validators"]), function(obj) { return obj["name"] == 'required' });
		if(obj['name'] != null){
			allValidators[allValidators.length] = Validators.required;
		}
		
		obj = _.find((prop["validators"]), function(obj) { return obj["min"] != -1 });
		if(obj['min'] != null){
			allValidators[allValidators.length] = Validators.minLength(obj['min']);
		}
		
		obj = _.find((prop["validators"]), function(obj) { return obj["max"] != -1 });
		if(obj['max'] != null){
			allValidators[allValidators.length] = Validators.minLength(obj['max']);
		}
		
		
		return allValidators;
		
	}

  private _setFormControls(propertyValue, controlValidators){
    let formBuilderControl;
		console.log("***************************************");
		console.log(propertyValue["defaultValue"][0]);
		console.log(propertyValue["dataType"]);
		console.log("***************************************");
    if((propertyValue['dataType'] === 'Boolean')){
      formBuilderControl = this._formBuilder.control('Yes', Validators.compose(controlValidators));
    } else if((typeof propertyValue["defaultValue"] === 'object') && (propertyValue["defaultValue"][0] === 'select')){
      formBuilderControl = this._formBuilder.control(propertyValue["defaultValue"][1], Validators.compose(controlValidators));
    } else if ((typeof propertyValue["defaultValue"] === 'object') && (propertyValue["defaultValue"][0] === 'radio')) { //radio
      //formBuilderControl = this._formBuilder.group(this._setRadioGroup(propertyValue["defaultValue"]));
			formBuilderControl = this._formBuilder.control(propertyValue["defaultValue"][1], Validators.compose(controlValidators));
    } else if ((typeof propertyValue["defaultValue"] === 'object') && (propertyValue["defaultValue"][0] === 'checkbox')) { //checkbox
      formBuilderControl = this._formBuilder.group(this._setCheckBoxGroup(propertyValue["defaultValue"]));
    } else if (typeof propertyValue["defaultValue"] === 'object') { //not defined
      formBuilderControl = this._formBuilder.control(propertyValue["defaultValue"][0], Validators.compose(controlValidators));
    } else if (this._isArray(propertyValue["defaultValue"])) {
      formBuilderControl = this._formBuilder.array([this._formBuilder.control(null, Validators.compose(controlValidators))]);
    } 
    return formBuilderControl;
  }
	
	/*private _setRadioGroup(properties){
		let controls = {};
    let formBuilderControl;
		for(let propt in properties) {
		  //shidrog
			if(propt){
				formBuilderControl = new RadioButtonState(false, properties[propt]);
				controls[properties[propt]] = formBuilderControl;
			}
		}
		return controls;
		
	}*/

	private _setCheckBoxGroup(properties){
		let controls = {};
    let formBuilderControl;
		for(let propt in properties) {
			//shidrog
			if(propt){
				formBuilderControl = this._formBuilder.control(null);
				controls[properties[propt]] = formBuilderControl;
			}
		}	
		return controls;
	}
	
  private _isArray(prop){
    if (prop.constructor.prototype.hasOwnProperty('push')) {
      return true;
    } else {
      return false;
    }
  }



  public buildHTMLByEntity(entity, formID, isUpload, aliasFields, excludedFields, defaultHTML){
    alert("buildHTMLByEntity -- isUpload" + isUpload);
    alert("buildHTMLByEntity -- entity" + entity);
    return Observable.create(observer => {
      observer.next(this._searchEntities(entity));
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      //console.log(this.entities);
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      observer.next(this._generateFormHTML(this.entities["dataProperties"], this.entities["navigationProperties"], aliasFields, excludedFields, defaultHTML, formID, isUpload));
      observer.complete();
    });

  }

  public onSubmitForm(myForm) {

    //myForm.value["formID"] = this.formID;
    myForm.value["formID"] = this.formID;

    this._setComplexValues(myForm);
		console.log("-------------------------------------");
    console.log(myForm.value["postURL"]);
    console.log("-------------------------------------");
    this._postFormByType(myForm.value["postURL"],myForm.value);

  }
  private _postFormByType(entity, myForm){
    console.log("-------------------------------------");
    console.log(entity);
    console.log(this.contentHeader );
    console.log("-------------------------------------");
    let postUrl = this.globals.getPostUrlByEntity(entity);
    console.log(postUrl);

    this.http.post(postUrl, JSON.stringify(myForm), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data),
        err => this.error = err,
        () => console.log('Create '+ entity + ' request Complete')
      );
  }

  authSuccess(data) {
		console.log("SUCCESS------SUCCESS------SUCCESS------SUCCESS------SUCCESS------SUCCESS------");
    console.log(JSON.stringify(data));
    console.log("SUCCESS------SUCCESS------SUCCESS------SUCCESS------SUCCESS------SUCCESS------");
		
    this.myCameraService.getImageToUpload(data._id, data.formID);
  }
  
  private _setComplexValues(myForm){
    alert(this.currentUser["_id"]);
    console.log(myForm.value);
    for(let propt in myForm.value) {
      switch (propt)
      {
        case "pictures":
          myForm.value[propt] = [];
          console.log("SET PICTURES ARRAY");
          break;
        case "admins":
          myForm.value[propt] = this.currentUser["_id"];
          console.log("SET ADMINS: " + this.currentUser["_id"]);
          break;
				case "creator":
          myForm.value[propt] = this.currentUser["_id"];
          console.log("SET CREATOR: " + this.currentUser["_id"]);
          break;
        case "testing":
          myForm.value[propt] = this.currentUser["_id"];
          console.log("SET TESTING: " + this.currentUser["_id"]);
          break;
        default:
          console.log('Default case:' + propt);
          break;
      }
    }
    console.log(myForm.value);
  }

  private _generateFormHTML(properties, navigationProperties, aliasFields, excludedFields, defaultHTML, formID, isUpload){
    this.formID = formID;
    let structureObject = {};
    let propertyArray = [];
    let bodyHTML = '';
    let elementHTML = '';
    let startForm = '<form novalidate *ngIf="formActive" [formGroup]="entityForm" (ngSubmit)="onSubmitForm()">'+"\n\t";
    //let endForm = '</form><debug-panel style="z-index:999999999;margin-top:50px" [data]="entityForm.value"></debug-panel>';
    //let endForm = '<form-buttons [data]="entityForm"></form-buttons></form>';
    let endForm = '</form>';

    bodyHTML = startForm;
		let obj = {};
    for(let propt in properties) {
			
			console.log("******************************************************");
			
			console.log(properties[propt]["name"]);
			obj = _.find((navigationProperties), function(obj) { return obj["name"] == properties[propt]["name"]});
			console.log(obj);
			
			console.log("******************************************************");
			
			if(this.excludedFieldsHTML.indexOf(properties[propt]["name"]) === -1 && obj === undefined){
				
				if(properties[propt]["dataType"] === 'String' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLInputControls("text", properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] === 'Decimal' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLInputControls("number", properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] === 'DateTime' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLDateTimeControl("date", properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] === 'Boolean' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLBooleanSelectGroup(properties[propt])
				}
				
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'select' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLSelectGroup(properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'radio' && typeof properties[propt]["defaultValue"] === 'object'){
					//elementHTML = this._setHTMLRadioGroup(properties[propt], aliasFields);
					elementHTML = this._setHTMLSelectGroup(properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'checkbox' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLCheckBoxGroup(properties[propt], aliasFields);
				} 
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLDefaultSelectGroup(properties[propt], aliasFields);
				} 			
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"] === 'array' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLArrayGroup(properties[propt], aliasFields);
				}
				else if(properties[propt]["name"] === 'pictures'){
          alert("_generateFormHTML -- isUpload" + isUpload);
					elementHTML = this._setHTMLPictures(this.entityType, formID, isUpload);
				}
			}
      bodyHTML += elementHTML;
      elementHTML = '';
    }
    bodyHTML += endForm;

    console.log("-------------------");
    //console.log(structureObject);
    console.log(bodyHTML);
    return bodyHTML;
  }
	private _setHTMLInputControls(inputType, property, aliasFields){
		/*<ion-item>
			<ion-label fixed>name</ion-label>
			<ion-input type="text" value="" formControlName="name"></ion-input>
		</ion-item>*/
		let startElement = '<ion-item><ion-label fixed>'; 
		let endElement = '"></ion-input></ion-item>' +"\n\t";
		
		let dataType = inputType;
		let dataName = property["name"];
		let dataValue = property["defaultValue"];
		
		return startElement + dataName +'</ion-label><ion-input type="' + dataType + '" formControlName="' + dataName + endElement;
		
	}
	private _setHTMLDateTimeControl(inputType, property, aliasFields){
		/*
		<ion-item>
			<ion-label>Date</ion-label>
			<ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="myDate"></ion-datetime>
		</ion-item>
		*/
		let startElement = '<ion-item><ion-label>'; 
		let endElement = '"></ion-datetime></ion-item>' +"\n\t";
		
		let dataType = inputType;
		let dataName = property["name"];
		let dataValue = property["defaultValue"];
		
		return startElement + dataName +'</ion-label><ion-datetime displayFormat="MM/DD/YYYY" formControlName="' + dataName + endElement;
		
	}
	
	private _setHTMLSelectGroup(properties, alias){
		//<select formControlName="specialtySandwich" #specialtySandwich="ngForm">
		
		/*
		
		<ion-select formControlName="_select" #_select="ngForm">
			<ion-option value="OPEN">OPEN</ion-option>
			<ion-option value="CLOSE">CLOSE</ion-option>
			<ion-option value="REQUEST">REQUEST</ion-option>
			<ion-option value="ADMIN_INVITE">ADMIN_INVITE</ion-option>
			<ion-option value="MEMBER_INVITE">MEMBER_INVITE</ion-option>
		</ion-select>

		*/
		//properties[propt]["defaultValue"]
		let controlName = properties["name"];
		
		let startElement ='<ion-item><ion-label>'; 
		let endElement = '</ion-select></ion-item>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
      //shidrog
			if(propt){
				//<option value="The Grinder">The Grinder</option>
				//console.log("------------------------------------------------------ : " + properties["defaultValue"][0]);
				options += '<ion-option value="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</ion-option>' + "\n\t";
			}
		}
		return startElement + controlName +'</ion-label><ion-select formControlName="' + controlName + '" let ' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	private _setHTMLDefaultSelectGroup(properties, alias){
		//<select formControlName="specialtySandwich" #specialtySandwich="ngForm">
		
		/*
		
		<ion-select formControlName="_select" #_select="ngForm">
			<ion-option value="OPEN">OPEN</ion-option>
			<ion-option value="CLOSE">CLOSE</ion-option>
			<ion-option value="REQUEST">REQUEST</ion-option>
			<ion-option value="ADMIN_INVITE">ADMIN_INVITE</ion-option>
			<ion-option value="MEMBER_INVITE">MEMBER_INVITE</ion-option>
		</ion-select>

		*/
		//properties[propt]["defaultValue"]
		let controlName = properties["name"];
		
		let startElement ='<ion-item><ion-label>'; 
		let endElement = '</ion-select></ion-item>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
			options += '<ion-option value="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</ion-option>' + "\n\t";
		}
		return startElement + controlName +'</ion-label><ion-select formControlName="' + controlName + '" let ' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	private _setHTMLBooleanSelectGroup(properties){
		let controlName = properties["name"];
		
		let startElement ='<ion-item><ion-label>'; 
		let endElement = '</ion-select></ion-item>' +"\n\t";
		
		let options = '';
		properties["defaultValue"] = [];
		properties["defaultValue"][0] = "Yes";
		properties["defaultValue"][1] = "No";
		
		for(let propt in properties["defaultValue"]) {
			options += '<ion-option value="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</ion-option>' + "\n\t";
		}
		return startElement + controlName +'</ion-label><ion-select formControlName="' + controlName + '" let ' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLRadioGroup(properties, alias){
		
		let controlName = properties["name"];
		
		let startElement ='<ul style="list-style: none;" ngControlGroup="';
		let endElement = '</ul>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
      //shidrog
			if(propt){
				/*
					<ion-item>
						<ion-label>Cord</ion-label>
						<ion-radio value="cord"></ion-radio>
					</ion-item>
				*/
				options += '<li> \n\t <input id="' + properties["defaultValue"][propt] + '" type="radio" name="' + controlName + '" formControlName="' + properties["defaultValue"][propt] + '">';
				options += '<label for="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</label>' + "\n\t";
			}
		}
		return startElement + controlName + '" let ' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLCheckBoxGroup(properties, alias){

		
		let controlName = properties["name"];
		
		let startElement ='<ion-item><ion-label>'+ controlName +'</ion-label></ion-item><div ngControlGroup="';
		let endElement = '</div>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
      //shidrog
			if(propt){
				/*
				<ion-item>
					<ion-label>Daenerys Targaryen</ion-label>
					<ion-checkbox dark checked="true"></ion-checkbox>
				</ion-item>

				*/
				options += '<ion-item> \n\t <ion-label for="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</ion-label>';
				options += '<ion-checkbox id="' + properties["defaultValue"][propt] + '" type="checkbox" formControlName="' + properties["defaultValue"][propt] + '"></ion-checkbox></ion-item>' + "\n\t";
			}
		}
		return startElement + controlName + '" let ' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLArrayGroup(properties, alias){
		//shidrog
    return '<div>shidrog - TODO<div>'

		
	}
	private _setHTMLPictures(entityType, formID, isUpload){
    alert("_setHTMLPictures -- isUpload" + isUpload);
		//alert(entityType);
		//unix
    //update form
    //send local picture id to photo component
    //this.formID = this.myCameraService.unixID();
    //this.formID = entityType;
    this.local.set(formID, []);
    alert("xxxxxxxxxx: " + formID);


    return '<photo-upload [formID]=' + '"'+ formID +'"' + ' [isUpload]=' + '"' + isUpload +'"' + ' [data]=' + '"' + entityType +'"' + '></photo-upload>';
	}
	/*
	private _setHTMLGroupControls(dataType, defaultValue, aliasFields){
		
		let startElement ='<input type="'; 
		let endElement = '">' +"\n\t";
		
		let dataType = inputType;
		let dataName = property["name"];
		let dataValue = property["defaultValue"];
		
		return startElement + dataType +'" placeholder="' + dataName + '" formControlName="' + dataName + endElement;
	}
*/

}