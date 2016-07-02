import {Page, NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {Http} from '@angular/http';
import {CountriesService} from './countries-service';
import {RegisterPage} from '../register/register';
//import {TimerWrapper} from 'angular2/src/facade/async';



@Page({
  templateUrl: 'build/pages/countries/countries.html',
  providers : [CountriesService]
})
export class CountriesPage {

  countries: Array<{callingCodes: number, alpha2Code: string, name: string, callingDigits: string, digitsValidator: string}>;
  items: Array<{callingCodes: number, alpha2Code: string, name: string, callingDigits: string, digitsValidator: string}>;
  alphabet: Array<{callingCodes: number, alpha2Code: string, name: string, callingDigits: string, digitsValidator: string}>;
  sorted_items: Object;
  selectedItem:string;
  local: Storage = new Storage(LocalStorage);
  countryName:string;
  callingCodes:string;
  callingDigits:string;
  jsonResult:Object;
  queryText:string;
  toggleToolbar:boolean;


  constructor(private nav:NavController, private navParams:NavParams, private countriesService:CountriesService) {
    this.nav = nav;
    this.countriesService = countriesService;
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedItem = navParams.get('item');
    this.countries = [];
	  this.toggleToolbar = false;
  }

  ngOnInit() {
    this.countriesService.findAll().subscribe(
      data => this.countries = data
    );
    this.alphabetList(this.countries);
  }
  
  toggleToolbars(){
	  this.toggleToolbar = !this.toggleToolbar;
  }
  
  searchLowerCase(){
    let lowerInput = this.queryText.toLowerCase();
    this.searchCountries(lowerInput);
  }

  searchCountries(queryText){
    this.countriesService.findByName(queryText).subscribe(
        data => this.items = data
    );    
  }

  itemTapped(event, callingCodes ,countryName, callingDigits, digitsValidator) {
    this.local.set('countryNameDetails', JSON.stringify(countryName));
    this.local.set('callingCodesDetails', JSON.stringify(callingCodes));
    this.local.set('callingDigitsDetails', JSON.stringify(callingDigits));
    this.local.set('digitsValidator', JSON.stringify(digitsValidator));
    setTimeout(() => {
      this.nav.setRoot(RegisterPage);
    }, 100);
    /*TimerWrapper.setTimeout(() => {  
      this.nav.setRoot(RegisterPage);
    }, 100);*/
  }

  alphabetList(countries){
    this.items = [];
    this.items = countries;
    let tmp = {};
    for (let i = 0; i < this.items.length; i++) {
      let letter = this.items[i]['name'].toUpperCase().charAt(0);
      if (tmp[letter] == undefined) {
        tmp[letter] = []
      }
      tmp[letter].push(this.items[i]);
    }
    this.alphabet = this.iterateAlphabet(tmp).sort();
    this.sorted_items = tmp;
    //console.log("----------------------------- alphabet " + this.alphabet);
    //console.log("----------------------------- sorted_items " + JSON.stringify(this.sorted_items));

  }

  alphaScrollGoToList(id) {
    console.log(id);
    //location.hash(id);
    //ionicScrollDelegate.$getByHandle('alphaScroll').anchorScroll();
  }



  //Create alphabet object
  iterateAlphabet(alphabet) {
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (Object.keys(alphabet).length != 0) {
      str = '';
      for (let i = 0; i < Object.keys(alphabet).length; i++) {
        str += Object.keys(alphabet)[i];
      }
    }
    let numbers = new Array();
    for (let j = 0; j < str.length; j++) {
      let nextChar = str.charAt(j);
      numbers.push(nextChar);
    }
    return numbers;
  }
}
