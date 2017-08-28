import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity,Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Item} from 'native-base';
const {width, height} = Dimensions.get('window')

import LinearGradient from 'react-native-linear-gradient';

import login from './signup-theme';
import styles from './styles';

const {
    replaceAt,
} = actions;

const logo = require('../../../images/logo.png');
import LoginApi from '../../api/login'
let loginApi = new LoginApi()
import { NavigationActions } from 'react-navigation'
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home'})
    ]
});

export default class Register extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {

            scroll: false,
            cca2: 'US',
            code: "",
            error: '',
            validationMessage: ''
        };
    }



    replaceRoute(route) {
        if(route == 'home'){
            this.props.navigation.dispatch(resetAction);
            return;
        }

        this.props.navigation.navigate(route);
    }


    async validateCode(){
        try{
            await this.setState({
                error:''
            })
            let response = await loginApi.verifyCode(this.state.code);
            if (response.token) {

                this.replaceRoute('home');
            } else {
                this.replaceRoute('Login');
            }

            }catch(error) {
                this.setState({
                    error:'Code is not valid',
                    code: ""
                })
        }

    }


    render() {
        let message = undefined;
        if(this.state.validationMessage){
            message = <Text style={{ backgroundColor:'transparent',padding: 10, fontSize: 16, color: 'red'}}>
                {this.state.validationMessage}
            </Text>
        }

        let errorMessage = undefined;
        if(this.state.error){
            errorMessage = <View style={{  backgroundColor:'transparent',flexDirection: 'row',color: 'red', justifyContent: 'center',marginBottom:0 }}>
                <Text> {this.state.error}</Text>
            </View>

        }
        return (
            <LinearGradient


                colors={['#67ccf8', '#66cdcc']}
                style={styles.inputContainer}
            >


                <View style={styles.inputContainer}>

                    <View >
                        <View style={styles.thiscountsContainer}>
                            <Text style={styles.this}>This</Text>
                            <Text style={styles.thiscount}>Counts</Text>
                        </View>
                        <View style={styles.mainContainer}>

                            <Text style={styles.signginText}>We have sent you a SMS</Text>
                            <Text style={styles.decritpionLine2}>with a validation code!</Text>
                                <Item style={styles.nameTextInput} regular >
                                    <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='done' ref="1" onSubmitEditing={this.validateCode.bind(this)} onChangeText={(code) => this.setState({code})} placeholder='Validation Code' />
                                </Item>

                            {message}
                            {errorMessage}
                            <View style={{height:40,justifyContent: 'center', alignItems: 'center',width:width/2 + 120}}>

                                <TouchableOpacity  onPress={() => this.validateCode()}  style={{ width:100,height:30,borderRadius:10,backgroundColor:'skyblue',margin:3, flexDirection: 'row',  justifyContent: 'center',alignItems: 'center', } } regular>

                                    <Text style={{ color:'white',fontStyle: 'normal',fontSize:15 }}>VALIDATE</Text>

                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>







                </View>
            </LinearGradient>

        );
    }
}
