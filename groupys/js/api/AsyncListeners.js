import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyDhJN8O4943iyTuDWjCBWpKRM_fqXvcRZw",
    authDomain: "this-1000.firebaseapp.com",
    databaseURL: "https://this-1000.firebaseio.com",
    storageBucket: "this-1000.appspot.com"
});

class AsyncListeners {

    listeners = [];
    managementInit = false;

    constructor(){
        firebase.auth().signInAnonymously()
    }

    reset(){
        this.listeners = [];
    }

    addManagement(callback){
        if(!this.managementInit) {
            firebase.database().ref('Management').on('value', callback);
            this.managementInit = true;
        }
    }
    addListener(key, callback) {
        if(!this.listeners.includes(key)) {
            this.listeners.push(key);
            firebase.database().ref('events').child(key).on('value', callback);
        }
    }

    delete(event,eventKey){
        irebase.database().ref('events').child(key).delete(eventKey)
    }


    syncChange(key,value) {
       firebase.database().ref('events').child(key).push(value);

    }

}
const asyncListeners = new AsyncListeners();
export default asyncListeners;