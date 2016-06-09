import {Page, NavController} from 'ionic-angular';
import {Hero, HEROES} from './hero';
import {Q} from './q';
import {BreezeHeroService} from './breeze-hero-service';

@Page({
  templateUrl: 'build/pages/breeze/breeze.html',
  providers: [BreezeHeroService]
})
export class BreezePage {

  heroes: Hero[];
  myHero:Hero;
  
  emps: any[];
  myEmp: any;
  
  emsg:string;
  
  constructor(public nav: NavController, private _heroService:BreezeHeroService) {
  
	//this.getHeroes() // ES6 Promise
    this.getHeroesQ()  // Q/ES6 Promise adapter
    
    .then((heroes: Hero[]) => {
	  console.log("this.getHeroesQ");
      this.heroes = heroes; 
      this.myHero = heroes[0];     
    })
    
    this.getEmps();
  }
  
   // ES6 Version
  getHeroes(){
    return new Promise((resolve, reject) => {
	  console.log("this.getHeroes()");
      setTimeout(() => resolve(HEROES), 100);
    });
  }
  
  // Q/ES6 Adapter Version
  getHeroesQ(){
    let deferred = Q.defer();
	console.log("getHeroesQ()");
    setTimeout(() => deferred.resolve(HEROES), 100);
    return deferred.promise;
  }
  
  getEmps() {
    this._heroService.getEmps()
      .then((emps:any[]) => {
        this.emps = emps;
        this.myEmp = emps[0];
      })
      .catch((emsg:string) => this.emsg = emsg)
  }
}
