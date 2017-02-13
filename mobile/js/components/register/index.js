import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';
import store from 'react-native-simple-store';



import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import login from './register-theme';
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
    }

    constructor(props) {
        super(props);
        store.get('token').then(token => {
            this.state = {
                authToken: token,
            };
        });
        this.state = {
            registerCode: '',
            validationMessage: '',
            userId:''
        };
    }


    replaceRoute(route) {
        this.props.replaceAt('register', {key: route}, this.props.navigation.key);
    }


    getUserId(){

        if(this.state.userId){
            return;
        }
        fetch('http://low.la:9000/api/users/me', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer '+ this.state.authToken,
            }

        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData._id) {
                    this.setState({
                        userId: responseData._id
                    })
                } else {
                    this.replaceRoute('login');
                }

            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
               // this.replaceRoute('login');
        });
    }

    registerUser() {

        this.setState({
            validationMessage: ''
        });

        this.getUserId();

        fetch('http://low.la:9000/api/users/verificaiton/'+ this.state.userId + "/" + this.state.registerCode, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer '+ this.state.authToken,
            }

        }).then((response) =>
        {
            if (response.status == '200') {
                this.replaceRoute('home');
                return;
            }

            this.setState({
                validationMessage: 'Code is not valid'
            });

        })
           .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // this.replaceRoute('login');
        });
    }


    render() {
        return (
            <Container>
                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>
                    <Image source={logo} style={styles.shadow}/>
                    {/*<div>*/}
                    {/*<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />*/}
                    {/*<button onClick={this.showAlert}>Show Alert</button>*/}
                    {/*</div>*/}
                    <View style={styles.inputContainer}>



                        <View style={{marginBottom: 20}}>
                            <InputGroup >
                                <Icon name="ios-unlock-outline"/>
                                <Input
                                    placeholder="Please Register Code"
                                    secureTextEntry
                                    onChangeText={registerCode => this.setState({registerCode})}
                                />
                            </InputGroup>
                        </View>


                        <Button style={styles.login} onPress={() => this.registerUser({
                            registerCode: this.state.registerCode,

                        }) }>
                            Validate Code
                        </Button>
                        <Text style={{padding: 10, fontSize: 16, color: 'red'}}>
                            {this.state.validationMessage}
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
