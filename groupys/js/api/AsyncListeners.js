import * as firebase from "firebase";

class AsyncListeners {

    listeners = [];

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