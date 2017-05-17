import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';




import login from './signup-theme';
import styles from './styles';

const {
    replaceAt,
} = actions;

const logo = require('../../../images/logo.png');
import LoginApi from '../../api/login'
let loginApi = new LoginApi()

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
        return (
            <Container>
                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>
                    <Image source={logo} style={styles.shadow}/>
                    <View style={styles.inputContainer}>


                        <View style={{marginBottom: 20}}>
                            <InputGroup >
                                <Icon name="ios-code" style={{color:"#00F"}}/>
                                <Input
                                    placeholder="Code"
                                    secureTextEntry
                                    placeholderTextColor='#444'
                                    onChangeText={code => this.setState({code})}
                                />
                            </InputGroup>
                        </View>


                        <Button style={styles.login} onPress={ this.validateCode.bind(this)}>
                            <Text>Validate Code</Text>
                        </Button>
                        <Text>
                            {this.state.error}
                        </Text>
                    </View>


                </Content>
            </Container>
        );
    }
}
