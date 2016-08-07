import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {PromiseWrapper} from '@angular/core/src/facade/promise';
import {Q} from './q';
import {EntityManagerFactoryService} from './entityManagerFactory';
import {Observable} from 'rxjs/Observable';

// Configure breeze with Q/ES6 Promise adapter
breeze.config.setQ(Q);

@Injectable()
export class DataContextService {

  error: string;
  manager: any;
  EntityQuery: any;
  storeMeta: any;
  entityNames: any;
  $q: any;
  primePromise: any;


  constructor(private http:Http, private entityManagerFactoryService:EntityManagerFactoryService, private promiseWrapper:PromiseWrapper) {

    this.EntityQuery = breeze.EntityQuery;
    this.manager = entityManagerFactoryService.newManager();
    //this.$q = promiseWrapper;
    this.$q = Q;

    this.storeMeta = {
      isLoaded: {
        contacts: false
      }
    };
    this.entityNames = {
      contacts: 'contacts'
    };

  }

  getContacts(forceRemote, page, size, nameFilter){
    let orderBy = 'name';

    let take = size || 20;
    let skip = page ? (page - 1) * size : 0;

    if(this._areContactsLoaded() && !forceRemote) {
      return this.$q.when(getByPage());

    }
    if(forceRemote) {
      this._resetCache2(this.entityNames.contacts);
    }
    return this.EntityQuery.from(this.entityNames.contacts)
      .using(this.manager).execute()
      .then(querySucceeded)
      .catch(_queryFailed);

    function querySucceeded(data){
      console.log("forceRemote:" + forceRemote);
      this._areContactsLoaded(true);
      //log('Retrieved [Contacts] from remote data source', data.results.length, true );
      return getByPage();
    }
    function _queryFailed(error){
      //let msg = config.appErrorPrefix + 'Error retrieving date.' + error.message;
      //logError(msg, error);
      throw error;
    }
    function getByPage() {
      let predicate = null;
      if(nameFilter) {
        predicate = this._namePredicate(nameFilter);
      }
      let contacts = this.EntityQuery.from(this.entityNames.contacts)
        .where(predicate)
        .take(take)
        .skip(skip)
        .using(this.manager)
        .executeLocally();
      return contacts;
    }
  }

  _areContactsLoaded(value) {
    return this._areItemsLoaded(this.entityNames.contacts, value);
  }

  _areItemsLoaded(key, value) {

    if(value === undefined) {
      //console.log(storeMeta.isLoaded[key]);
      return this.storeMeta.isLoaded[key]; // get the value

    }
    console.log(this.storeMeta.isLoaded[key]);
    this.storeMeta.isLoaded[key] = value; // set the value
    return this.storeMeta.isLoaded[key]; // set the value
  }

  _namePredicate(filterValue) {
    return breeze.Predicate.create("name","contains",filterValue)
      .or("_id","contains",filterValue);
    //.or("category","contains",filterValue);
  }
  _resetCache2(entityName){
    let x = this.manager.getEntities(entityName); // all entityName in cache
    // Todo: this should be a function of the Breeze EntityManager itself
    x.forEach(function (entity) { this.manager.detachEntity(entity); });
  }
  getContactsCount() {
    if(this._areContactsLoaded()) {
      return this.$q.when(this._getLocalEntityCount(this.entityNames.contacts));
    }
    return this.EntityQuery.from(this.entityNames.contacts)
      .using(this.manager)
      .execute()
      .then(this._getInlineCount);
  }
  _getLocalEntityCount(resource) {
    let entities = this.EntityQuery.from(resource)
      .using(this.manager)
      .executeLocally();
    return entities.length;
  }
  _getInlineCount(data) {
    return data.inlineCount;
  }
  getContactsFilteredCount(nameFilter) {
    let predicate = this._namePredicate(nameFilter);

    let contacts = this.EntityQuery.from(this.entityNames.contacts)
      .where(predicate)
      .using(this.manager)
      .executeLocally();
    return contacts.length;
  }

  primeContacts() {
    console.log("inside prime contacts");
    if(this.primePromise){return this.primePromise;}

    this.primePromise = this.$q.all([this.getContacts()])
      .then(extendMetadata)
      .then(success);
    console.log("primePromise:  " + this.primePromise);
    return this.primePromise;

    function success() {
      console.log("inside success");
      this.setLookups();
      console.log('primed the contacts data');
    }

    function extendMetadata() {
      console.log("inside extendMetadata contacts");
      let metadataStore = this.manager.metadataStore;
      let types = metadataStore.getEntityTypes();
      types.forEach(function(type) {
        if(type instanceof breeze.EntityType) {
          set(type.shortName, type);
        }
      });

      function set(resourceName,entityName) {
        console.log("inside set");
        metadataStore.setEntityTypeForResourceName(resourceName,entityName);
      }
    }
  }
  getLookups() {
    console.log("inside getLookups");
  }
  setLookups(){
    console.log("inside setLookups");
  }


}
