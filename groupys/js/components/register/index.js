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
        this.props.replaceAt('register', {key: route}, this.props.navigation.key);
    }


    async validateCode(){
        try{
            let response = await loginApi.verifyCode(this.state.code);
            if (response.token) {

                this.replaceRoute('home');
            } else {
                this.replaceRoute('login');
            }

            }catch(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                this.replaceRoute('login');
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


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Register);
