/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    Image,
    TouchableOpacity,
    TextInput,
    Input

} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import store from 'react-native-simple-store';
const NativeModules = require('NativeModules');
const RNUploader = NativeModules.RNUploader;
var From = require("./components/form");
var QcCode = require("./components/qccode");

export default class examples extends Component {
    constructor(props) {
        super();
        this.state = {
            image: null,
            path:'',
            images: null,
            token:'',
            registerCode: '',
            validationMessage:'',
            user:"",
            password:"",
            userId:"",
            titleText: "Business Form",
            name: "Name: ",
            Address: "Address:",
            bodyText: 'example for business form.'
        };
    }

    setSt(){
        console.log("bla");

    }



    pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }
    signup() {


        fetch('http://low.la:9000/api/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                phone_number: '+9720544402680',
                email: "roi@lowla.co.il",
                password: "de123456",


            })
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.token) {
                    store.save('token', responseData.token);
                    this.setState({token:responseData.token})
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);

        });
    }

    login(){
        fetch('http://low.la:9000/auth/local', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                email:  this.state.user,
                password:this.state.password,
            })
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.token) {
                    store.save('token', responseData.token);
                    this.setState({token:responseData.token})
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);

        });
    }

    getUser(){
        fetch('http://low.la:9000/api/users/me/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + this.state.token,
            }

        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData._id) {

                    this.setState({userId:responseData._id})
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);

        });

    }

    registerUser() {

        this.setState({
            validationMessage: ''
        });

        //this.getUserId();

        fetch('http://low.la:9000/api/users/verification/' + this.state.registerCode, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + this.state.token,
            }

        }).then((response) =>
        {
            console.log(this.state.authToken);
            if (response.status == '200') {

                return;
            }

            this.setState({
                validationMessage: 'Code is not valid'
            });

        })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                this.replaceRoute('login');
            });
    }

    saveForm(data){
        console.log(data);
    }

    doUpload() {
        let files = [
            {
                name: "myimange",
                filename: 'image1.png',
                filepath:this.state.image.uri,  // image from camera roll/assets library
                filetype: this.state.image.mime,
            }

        ];

        let opts = {
            url: 'http://low.la:9000/api/images/' + this.state.userId,
            files: files,
            method: 'POST',                             // optional: POST or PUT
            headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.state.token },  // optional
            params: { },                   // optional
        };

        RNUploader.upload( opts, (err, response) => {
            if( err ){
                console.log(err);
                return;
            }

            let status = response.status;
            let responseString = response.data;
            let json = JSON.parse( responseString );

            console.log('upload complete with status ' + status);
        });
    }

    render() {


        return (

            <View style={styles.container}>

                    <QcCode/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign:  "left"
    },
    button: {
        backgroundColor: 'blue',
        marginBottom: 10
    },
    stretch: {
        width: 50,
        height: 50
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('examples', () => examples);
