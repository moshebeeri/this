import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyDhJN8O4943iyTuDWjCBWpKRM_fqXvcRZw",
    authDomain: "this-1000.firebaseapp.com",
    databaseURL: "https://this-1000.firebaseio.com",
    storageBucket: "this-1000.appspot.com"
});

class AsyncListeners {

    listeners = [];

    constructor(){
        firebase.auth().signInAnonymously()
    }

    addListener(key, callback) {
        if(!this.listeners.includes(key)) {
            this.listeners.push(key);
            firebase.database().ref(key).on('value', callback);
        }
    }

    syncChange(key,value) {
        firebase.database().ref(key).push(value)
    }
}
const asyncListeners = new AsyncListeners();
export default asyncListeners;