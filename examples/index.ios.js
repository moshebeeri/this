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
    TouchableOpacity

} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

export default class examples extends Component {
    constructor(props) {
        super();
        this.state = {
            image: null,
            path:'',
            images: null
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

    render() {


        return (
            <View style={styles.container}>
              <Text style={styles.welcome}>
                Image cropper
              </Text>
              <Text style={styles.instructions}>
                To get started, edit index.ios.js
              </Text>
              <Text style={styles.instructions}>
                Press Cmd+R to reload,{'\n'}
                Cmd+D or shake for dev menu
              </Text>
              <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
                <Text style={styles.text}>Select Single With Cropping</Text>
              </TouchableOpacity>
              <Image
                  style={{width: 50, height: 50}}
                  source={{uri: this.state.path}}
              />
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
