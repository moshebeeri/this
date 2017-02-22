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
            userText:"User"
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
        }).then(function (response) {
            console.log(response._bodyText);
            console.log(response.status);

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



    render() {


        return (
            <View style={styles.container}>



                <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
                <Text style={styles.text}>Select Single With Cropping</Text>
              </TouchableOpacity>
              <Image
                  style={{width: 50, height: 50}}
                  source={{uri: this.state.path}}
              />

                <TouchableOpacity onPress={() => this.signup()} style={styles.button}>
                    <Text style={styles.text}>signup user</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.registerUser()} style={styles.button}>
                    <Text style={styles.text}>register user</Text>
                </TouchableOpacity>
                <View style={{marginBottom: 20}}>
                    <TextInput
                        style={{height: 20,width: 100, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(registerCode) => this.setState({registerCode})}

                    />
                </View>
                <View style={{marginBottom: 20}}>

                    <TextInput
                        style={{height: 20,width: 200, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(user) => this.setState({user})}
                        placeholder="USER"

                    />
                </View>
                <View style={{marginBottom: 20}}>

                    <TextInput
                        style={{height: 20,width: 200, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(password) => this.setState({password})}
                        placeholder="PASSWORD"

                    />
                </View>
                <TouchableOpacity onPress={() => this.login()} style={styles.button}>
                    <Text style={styles.text}>login</Text>
                </TouchableOpacity>

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
