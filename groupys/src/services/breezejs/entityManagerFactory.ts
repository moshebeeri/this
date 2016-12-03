import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { EntityManager, DataService, MetadataStore } from 'breeze-client';
//import { EntityManager, DataService, MetadataStore, Entity, NamingConvention } from 'breeze-client';
//import {Q} from './q';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Configure breeze with Q/ES6 Promise adapter
//breeze.config.setQ(Q);

@Injectable()
export class EntityManagerFactoryService {

  entityManager: EntityManager;
  private _metadataStore: MetadataStore;

  private _manager:any; // no type def for EM yet
  baseURL: string;
  error: string;
  serviceName: string;
  contentHeader: Headers = new Headers();
  metadataStore: any;
  store: any;
  manager: any;
  
  
	constructor(private http:Http) {
		if (window.location.host.match("localhost")) {
			this.baseURL = "http://localhost:9000/api/";
		} else {
			this.baseURL = "http://low.la:9000/api/";
		}
		this.http = http;
		this.serviceName = this.baseURL + 'breeze/metadata';
		//this.store = new breeze.MetadataStore();
		this.store = new MetadataStore();
	}
  
	emFactory() {
		console.log("INSIDE EM");
		return Observable.create(observer => {
            observer.next(this.getMetadataStore());
            observer.next(this.newManager());
            observer.complete();
        });
	}
	
	getMetadataStore() {
		this.http.get(this.serviceName, { headers: this.contentHeader })
			.map(res => res.json())
			.subscribe(
				data => this.setMetadataStore(data),
				err => this.error = err
			);
	}
	
	setMetadataStore(data){

		// Because of Breeze bug, must stringify metadata first.
		this.store.importMetadata(JSON.stringify(data));
		
		let allTypes = this.store.getEntityTypes();
		console.log(allTypes);

    let groupType = this.store.getEntityType('Group');
    console.log(groupType.dataProperties);

		console.log(this.store.isEmpty());

		// Associate these metadata data with the service
		// if not already associated
		if (!this.store.hasMetadataFor(this.serviceName)){
			this.store.addDataService(
				//new breeze.DataService({ serviceName: this.serviceName }));
				new DataService({ serviceName: this.serviceName }));
		}
		console.log(this.store);

	}

	newManager() {

		//let mgr = new breeze.EntityManager({
		let mgr = new EntityManager({
			serviceName: this.serviceName,
			metadataStore: this.store
		});
		//mgr.enableSaveQueuing(true);
		return mgr;
	}
}