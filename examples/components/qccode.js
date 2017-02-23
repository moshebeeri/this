import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    Text,
    TextInput,
    View,
    Button,
    Image,
    TouchableOpacity,
    TouchableHighlight ,
    Icon
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
export default class qcCode extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: null,
            address:''
        };
    }

    readQc(code){
        console.log(code);

    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{

                    flexDirection: 'column',
                    width: 300,
                    height: 500,

                }}>

                    <NavigatorIOS
                            initialRoute={{
                                component: QRCodeScanner,
                                title: 'Scan Code',
                                passProps: {
                                    onRead: this.readQc.bind(this),
                                 }
                            }}
                            style={{flex: 1}}
                        />
                </View>

            </View>
        )


    }


}

const styles = StyleSheet.create({
    container: {

        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex:1

    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        marginLeft:10,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign:  "left",
        width: 50
    },
    row: {
        marginTop:5,
        flexDirection: 'row'

    },

    input:{

        height: 20,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1
    },
    btnClickContain: {

        flexDirection: 'row',
        justifyContent: 'center',
        width: 20,
        height: 20,
        backgroundColor: '#009D6E',
        borderRadius: 5,

    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        borderRadius: 10,
    },
    btnIcon: {
        height: 25,
        width: 25,
    },
    btnText: {
        fontSize: 3,
        color: '#FAFAFA',
        marginLeft: 10,
        marginTop: 2,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        borderRadius: 3,
        padding: 32,
        width: 100,
        marginTop: 64,
        marginBottom: 64,
    },

    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },

    textBold: {
        fontWeight: '500',
        color: '#000',
    },

    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },

    buttonTouchable: {
        padding: 16,
    },

});

module.exports=qcCode;
