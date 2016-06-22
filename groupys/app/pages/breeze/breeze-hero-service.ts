import {Injectable} from '@angular/core';
import {Q} from './q';

// Configure breeze with Q/ES6 Promise adapter
breeze.config.setQ(Q);

@Injectable()
export class BreezeHeroService { 
  
  private _manager:any; // no type def for EM yet
  constructor() {
    // create a new manager talking to sample service 
    let host="http://sampleservice.breezejs.com";
    let serviceName = host+"/api/northwind";
    this._manager = new breeze.EntityManager(serviceName);
	console.log(this._manager);    
  }

  getEmps(){
    return breeze.EntityQuery
      .from('Employees')
      .using(this._manager).execute()
      .then(success).catch(failed);
      
    function success(data) {
      let emps = data.results;
      var msg = ('Queried ' + emps.length + ' employees');
      console.log(msg);
      return emps;
    }
  
    function failed(error) {
      var msg = "Query failed: " + error.message;
      console.error(msg);
      return Promise.reject(msg); // use ES6 promise within A2 app
    }
  }
  
}