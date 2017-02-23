import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    Image,
    TouchableHighlight ,
    Icon
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
//var ImageButton = require('react-native-icon-button');

export default class myForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: null,
            address:'',
            email:'',
            website:'',
            country:'',
            city:'',
            state:'',
            path:'',
            image:'',
            images:''




        };
    }


    saveFormData(){
        this.props.saveForm(this.state);
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


                <View style={{

                    flexDirection: 'column',

                }}>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                          Name
                        </Text>
                        <TextInput style={styles.input}
                            onChangeText={(name) => this.setState({name})}

                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            Email
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(email) => this.setState({email})}

                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            Website
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(website) => this.setState({website})}

                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            Country
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(country) => this.setState({country})}

                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            City
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(city) => this.setState({city})}

                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            State
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(state) => this.setState({state})}

                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            Image
                        </Text>
                        <TouchableHighlight
                            onPress={() => this.pickSingle(true)} style={styles.btnClickContain}
                           >
                            <Image
                                style={{flex: 1,width: 20,
                                    height: 20}}
                                source={ require('../image/attach.png')}
                            />
                        </TouchableHighlight>
                        <Image
                            style={{width: 50, height: 50}}
                            source={{uri: this.state.path}}
                        />
                    </View>

                    <Button
                        onPress={this.saveFormData.bind(this)}
                        title="Save"
                        color="#841584"

                    />
                </View>
            </View>
        )


    }


}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',


        marginRight: 10
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
    }

});

module.exports=myForm;
