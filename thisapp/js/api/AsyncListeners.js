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


    markAsRead(key){
        firebase.database().ref('events').child(key).set({"markAsRead": true});
    }

    syncChange(key,value) {
       firebase.database().ref('events').child(key).set(value);

    }

    syncChangeChild(key,subKeyValue,subKey,value) {

        firebase.database().ref('events').child(key).child(subKeyValue).child(subKey).set(value);


    }

}
const asyncListeners = new AsyncListeners();
export default asyncListeners;