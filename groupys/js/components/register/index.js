import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';
import store from 'react-native-simple-store';


import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import login from './signup-theme';
import styles from './styles';
//import AlertContainer from 'react-alert';
const {
    replaceAt,
} = actions;

const logo = require('../../../images/logo.png');

class Register extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
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
        this.props.replaceAt('signup', {key: route}, this.props.navigation.key);
    }


    validateCode(){
        let code = this.state.code;
        store.get('token').then(token => {

            fetch('http://low.la:9000/api/users/verification/' + code, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                }

            }).then(
                (response) => response.json())
                .then((responseData) => {
                    if (responseData.token) {

                        this.replaceRoute('home');
                    } else {
                        this.replaceRoute('login');
                    }

                }).catch(function (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                this.replaceRoute('login');
            });
        })




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


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Register);
