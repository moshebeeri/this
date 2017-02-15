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

class Signup extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    }

    constructor(props) {
        super(props);
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)

        this.state = {
            email: '',
            password: '',
            phone_number: '',
            scroll: false,
            cca2: 'US',
            callingCode: "",
            error: '',
            validationMessage: ''
        };
    }
    componentDidMount(){
        this.setState({
            phone_number: this.refs.phone.getPickerData()
        })
    }

    onPressFlag(){
        this.refs.countryPicker.openModal()
        this.setState({
            phone_number: this.refs.phone.getPickerData()
        })
    }

    selectCountry(country){
        this.refs.phone.selectCountry(country.cca2.toLowerCase())
        this.setState({
            callingCode: country.callingCode
        });

        this.setState({cca2: country.cca2})
    }

    replaceRoute(route) {
        this.props.replaceAt('signup', {key: route}, this.props.navigation.key);
    }

    signup() {
        this.setState({
            validationMessage: ''
        });
        if(this.refs.phone.isValidNumber()) {
            this.callServerSignupAndRedirect();
            return;
        }

        this.setState({
            validationMessage: 'Invalid Number'
        })
    }

    callServerSignupAndRedirect() {
        var phoneNumber = this.refs.phone.getValue();
        var type = this.refs.phone.getNumberType();

        console.log(phoneNumber);
        console.log(type);
        console.log(this.state.callingCode);
        fetch('http://low.la:9000/api/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                email: phoneNumber + "@lowla.co.il",
                password: this.state.password,


            })
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.token) {
                    store.save('token', responseData.token);
                    this.replaceRoute('register');
                } else {
                    this.replaceRoute('login');
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);
            this.replaceRoute('login');
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


                            <PhoneInput
                                ref='phone'
                                onPressFlag={this.onPressFlag}
                                onChange={(value)=> this.componentDidMount(value)}
                            />
                            <CountryPicker
                                ref='countryPicker'
                                onChange={(value)=> this.selectCountry(value)}
                                translation='eng'
                                cca2={this.state.cca2}
                            >
                                <View></View>
                            </CountryPicker>

                            <Text style={{padding: 10, fontSize: 16, color: 'red'}}>
                                {this.state.validationMessage}
                            </Text>
                        </View>


                        <View style={{marginBottom: 20}}>
                            <InputGroup >
                                <Icon name="ios-unlock-outline"/>
                                <Input
                                    placeholder="Password"
                                    secureTextEntry
                                    onChangeText={password => this.setState({password})}
                                />
                            </InputGroup>
                        </View>


                        <Button style={styles.login} onPress={() => this.signup({
                            phone_number: this.state.phone_number,
                            password: this.state.password
                        }) }>
                            Signup
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

export default connect(mapStateToProps, bindActions)(Signup);
