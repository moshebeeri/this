import {Injectable} from '@angular/core';
import {ControlGroup, Control, ControlArray, RadioButtonState, FormBuilder, Validators} from '@angular/common';
import {ENTITIES} from '../entities/entities-data';
import {EntitiesService} from '../../services/entities/entities-service';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class FormBuilderService {

  entities: Array;
  entityForm: ControlGroup;
  controlArray: ControlArray;
  defaultHTML: Object;
  excludedFields: Array;
	


  constructor(private entitiesService:EntitiesService, private _formBuilder: FormBuilder) {
    this.entitiesService = entitiesService;
    this.entities = [];
    this.defaultHTML = {
      input: '',
      radioButton: '',
      select: '',
      checkBox:'',
      label: "",
      select:"",
      option:""
    };
		this.excludedFields = ["gid","id","creator","created"];
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
      console.log(this.entities);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      observer.next(this._generateFormStructure(this.entities));
      observer.complete();
    });
  }
	
	public onClearForm(myform, flag) {
    myform = this._formBuilder.group({});
    flag = false;
    setTimeout(() => {
      flag = true;
    }, 0);
  }
	
	public onSubmitForm(myForm, entityType) {
    console.log(myForm.value);
  }
	
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
      data => this.entities = data[0].dataProperties
    );
  }
  
  private _generateFormStructure(properties){
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
		
    for(let propt in properties) {
      //console.log(propt);//logs name
      //console.log(properties[propt]["defaultValue"]);//logs "Simon"

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
			
			

      structureObject[properties[propt]["name"]] = this._setFormControls(properties[propt]["defaultValue"], controlValidators);
      console.log(structureObject[properties[propt]["name"]]);

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
		
		let obj = _.find((prop["validators"]), function(obj) { return obj.name == 'required' });
		if(obj['name'] != null){
			allValidators[allValidators.length] = Validators.required;
		}
		
		obj = _.find((prop["validators"]), function(obj) { return obj.min != -1 });
		if(obj['min'] != null){
			allValidators[allValidators.length] = Validators.minLength(obj['min']);
		}
		
		obj = _.find((prop["validators"]), function(obj) { return obj.max != -1 });
		if(obj['max'] != null){
			allValidators[allValidators.length] = Validators.minLength(obj['max']);
		}
		
		
		return allValidators;
		
	}

  private _setFormControls(propertyValue, controlValidators){
    let formBuilderControl;
		console.log("***************************************");
		console.log(propertyValue[0]);
		console.log("***************************************");
    if((typeof propertyValue === 'object') && (propertyValue[0] === 'select')){
      formBuilderControl = this._formBuilder.control(null, Validators.compose(controlValidators));
    } else if ((typeof propertyValue === 'object') && (propertyValue[0] === 'radio')) { //radio
      formBuilderControl = this._formBuilder.group(this._setRadioGroup(propertyValue));
    } else if ((typeof propertyValue === 'object') && (propertyValue[0] === 'checkbox')) { //checkbox
      formBuilderControl = this._formBuilder.group(this._setCheckBoxGroup(propertyValue));
    } else if (this._isArray(propertyValue)) {
      formBuilderControl = this._formBuilder.array([this._formBuilder.control(null, Validators.compose(controlValidators))]);
    } else {
      formBuilderControl = this._formBuilder.control(null, Validators.compose(controlValidators));
    }
    return formBuilderControl;
  }
	
	private _setRadioGroup(properties){
		let controls = {};
    let formBuilderControl;
		for(let propt in properties) {
			if(propt != 0){
				formBuilderControl = new RadioButtonState(false, properties[propt]);
				controls[properties[propt]] = formBuilderControl;
			}
		}
		return controls;
		
	}

	private _setCheckBoxGroup(properties){
		let controls = {};
    let formBuilderControl;
		for(let propt in properties) {
			if(propt != 0){
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



  public buildHTMLByEntity(entity, aliasFields, excludedFields, defaultHTML){
    return Observable.create(observer => {
      observer.next(this._searchEntities(entity));
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      //console.log(this.entities);
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      observer.next(this._generateFormHTML(this.entities, aliasFields, excludedFields, defaultHTML));
      observer.complete();
    });

  }

  private _generateFormHTML(properties, aliasFields, excludedFields, defaultHTML){

    let structureObject = {};
    let propertyArray = [];
    let bodyHTML = '';
    let elementHTML = '';
    let startForm = '<form novalidate [ngFormModel]="entityForm" (ngSubmit)="onSubmitForm()">'+"\n\t";
    //let endForm = '</form><debug-panel style="z-index:999999999;margin-top:50px" [data]="entityForm.value"></debug-panel>';
    let endForm = '</form>';

    bodyHTML = startForm;
    for(let propt in properties) {

			if(this.excludedFields.indexOf(properties[propt]["name"]) === -1){
				
				if(properties[propt]["dataType"] === 'String' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLControls("text", properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] === 'Decimal' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLControls("number", properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] === 'DateTime' && typeof properties[propt]["defaultValue"] != 'object'){
					elementHTML = this._setHTMLControls("date", properties[propt], aliasFields);
				}
				
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'select' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLSelectGroup(properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'radio' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLRadioGroup(properties[propt], aliasFields);
				}
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"][0] != 'array' && properties[propt]["defaultValue"][0] === 'checkbox' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLCheckBoxGroup(properties[propt], aliasFields);
				} 			
				else if(properties[propt]["dataType"] != undefined && properties[propt]["dataType"] === 'array' && typeof properties[propt]["defaultValue"] === 'object'){
					elementHTML = this._setHTMLArrayGroup(properties[propt], aliasFields);
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
	private _setHTMLControls(inputType, property, aliasFields){
		//'<input type="text" placeholder="'+ properties[propt]["name"] + '" ngControl="' + properties[propt]["name"] +'">' +"\n\t";
		let startElement ='<input type="'; 
		let endElement = '">' +"\n\t";
		
		let dataType = inputType;
		let dataName = property["name"];
		let dataValue = property["defaultValue"];
		
		return startElement + dataType +'" placeholder="' + dataName + '" ngControl="' + dataName + endElement;
		
	}
	
	private _setHTMLSelectGroup(properties, alias){
		//<select ngControl="specialtySandwich" #specialtySandwich="ngForm">
		//properties[propt]["defaultValue"]
		let controlName = properties["name"];
		
		let startElement ='<select ngControl="'; 
		let endElement = '</select>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
			if(propt != 0){
				//<option value="The Grinder">The Grinder</option>
				//console.log("------------------------------------------------------ : " + properties["defaultValue"][0]);
				options += '<option value="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</option>' + "\n\t";
			}
		}
		return startElement + controlName + '" #' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLRadioGroup(properties, alias){
		
		let controlName = properties["name"];
		
		let startElement ='<ul ngControlGroup="';
		let endElement = '</ul>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
			if(propt != 0){
				/*
				<li>
					<input id="sizeSmall" type="radio" name="size" ngControl="sizeSmall">
					<label for="sizeSmall">Small</label>
				</li>*/
				options += '<li> \n\t <input id="' + properties["defaultValue"][propt] + '" type="radio" name="' + controlName + '" ngControl="' + properties["defaultValue"][propt] + '">';
				options += '<label for="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</label>' + "\n\t";
			}
		}
		return startElement + controlName + '" #' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLCheckBoxGroup(properties, alias){
		
		let controlName = properties["name"];
		
		let startElement ='<ul ngControlGroup="';
		let endElement = '</ul>' +"\n\t";
		
		let options = '';
		
		for(let propt in properties["defaultValue"]) {
			if(propt != 0){
				/*
				<li>
					<input id="sizeSmall" type="radio" name="size" ngControl="sizeSmall">
					<label for="sizeSmall">Small</label>
				</li>*/
				options += '<li> \n\t <input id="' + properties["defaultValue"][propt] + '" type="checkbox" ngControl="' + properties["defaultValue"][propt] + '">';
				options += '<label for="' + properties["defaultValue"][propt] + '">' + properties["defaultValue"][propt] + '</label>' + "\n\t";
			}
		}
		return startElement + controlName + '" #' + controlName + '="ngForm"> \n\t' + options + endElement;
		
	}
	
	private _setHTMLArrayGroup(properties, alias){
		
		
	}
	
	private _setHTMLGroupControls(dataType, defaultValue, aliasFields){
		
		let startElement ='<input type="'; 
		let endElement = '">' +"\n\t";
		
		let dataType = inputType;
		let dataName = property["name"];
		let dataValue = property["defaultValue"];
		
		return startElement + dataType +'" placeholder="' + dataName + '" ngControl="' + dataName + endElement;
	}


}