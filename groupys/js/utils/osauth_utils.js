import Fingerprint from 'react-native-fingerprint-android';
const React = require('react-native');
import {ToastAndroid as Toast} from 'react-native';

var ReactNative = require('react-native');
import { NativeModules } from 'react-native';
var TouchId = require('react-native-smart-touch-id').default;


var {
    Alert,
    AlertIOS,
} = ReactNative;


const {Platform} = React;

class OSAuthUtils {

    _isSupported = async () => {
        try {
            await TouchId.isSupported()
            Alert.alert('TouchId is supported!')
        } catch(e) {
            Alert.alert('TouchId is not supported!')
        }
    }

    _trggerTouchId = async () => {
        let description = 'Verify the existing mobile phone fingerprint using the home key'
        //let title       //fallback button title will be default as 'Enter Password'(localized)
        //let title = ""  //fallback button will be hidden
        let title = "Verify Password"   //fallback button title will be 'Verify Password'(unlocalized)
        try {
            await TouchId.verify({
                description,
                title,
            });
            //await TouchId.verify("123123123123");
            Alert.alert('verify succeeded')
        } catch(e) {
            if (e.code == '-3') {
                //fallback button is pressed
                Alert.alert('errorCode: ' + e.code + ' verify failed, user wants to ' + title)
            }
            else {
                Alert.alert('errorCode: ' + e.code + ' verify failed')
            }
        }
    }


    async fingerprint_auth() {
        return new Promise(async(resolve, reject) => {
            console.log("start function");
            if (Platform.OS === 'ios') {
                console.log("OS function");
                // await this._isSupported();
                //
                // await this._trggerTouchId();

                return resolve()

            } else if (Platform.OS === 'android') {
                console.log("OS andoris");
                if(!osauth)
                    return resolve();

                const hardware = await Fingerprint.isHardwareDetected();
                const permission = await Fingerprint.hasPermission();
                const enrolled = await Fingerprint.hasEnrolledFingerprints();

                if (!hardware || !permission || !enrolled) {
                    let message = !enrolled ? 'No fingerprints registered.' : !hardware ? 'This device doesn\'t support fingerprint scanning.' : 'App has no permission.';
                    Toast.show(message, Toast.SHORT);
                    return reject(message);
                }

                try {
                    await Fingerprint.authenticate(warning => {
                        let message = `Try again: ${warning.message}`;
                        Toast.show(message, Toast.SHORT);
                        return reject(message);
                    });
                } catch (error) {
                    let message = `Authentication aborted: ${error.message}`;
                    Toast.show(message, Toast.SHORT);
                    return reject(message);
                }

                Toast.show("Auth successful!", Toast.SHORT);
                return resolve();
            }
        });


    };


}

export default OSAuthUtils;
