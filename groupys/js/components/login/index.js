
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';

import store from 'react-native-simple-store';
const {
  replaceAt,
} = actions;

const logo = require('../../../images/logo.png');
import login from './login-theme';
import styles from './styles';
var contacsManager = require("../../utils/contactsManager");



class Login extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
        phoneNumber: '+972544402680',
      password: 'de123456',

      scroll: false,
        error:''
    };
  }

  login() {
      this.setState ({error: ''});
      let routFunc =  this.props;
      let currentState = this.setState.bind(this);
      let userFunc = this.getUser.bind(this);
      fetch(`${server_host}/auth/local`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
              email:  this.state.phoneNumber + "@lowla.co.il",
              password:this.state.password,
          })
      }).then(function (response) {
          if (response.status == '401') {
              currentState({error: 'Login Failed Validation'});
              return;
          }
          response.json().then((responseData) => {
              if (responseData.token) {
                  store.save('token', responseData.token);
                  userFunc(responseData.token);

              }
          })
          routFunc.replaceAt('login', { key: 'home' }, routFunc.navigation.key);

      }).catch(function (error) {
              console.log('There has been a problem with your fetch operation: ' + error.message);
      });

  }



    getUser(token){
        fetch(`${server_host}/api/users/me/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }

        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData._id) {
                    store.save('user_id', responseData._id);
                    contacsManager(token,responseData._id);
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);

        });

    }


    replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

    render() {
        return (
            <Container>
              <Content theme={login} style={{ backgroundColor: login.backgroundColor }} >
                <Image source={logo} style={styles.shadow} />
                <View style={styles.inputContainer}>
                  <View style={{ marginBottom: 20 }}>
                    <InputGroup>
                      <Icon name="ios-phone-portrait-outline" style={{color:"#00f"}}/>
                      <Input
                          keyboardType="phone-pad"
                          placeholderTextColor='#444'
                          placeholder="Phone"
                          defaultValue="+972544402680"
                          onChangeText={phoneNumber => this.setState({ phoneNumber })}
                      />
                    </InputGroup>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <InputGroup >
                      <Icon name="ios-unlock-outline" style={{color:"#00f"}}/>
                      <Input
                          placeholder="Password"
                          placeholderTextColor='#444'
                          defaultValue="de123456"
                          secureTextEntry
                          onChangeText={password => this.setState({ password })}
                      />
                    </InputGroup>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center',marginBottom:10 }}>
                    <Text> {this.state.error}</Text>
                  </View>


                  <Button transparent style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot Login details?</Text>
                  </Button>
                  <Button style={styles.login} onPress={this.login.bind(this) }>
                    <Text>Login</Text>
                  </Button>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 }}>
                  <Button style={styles.logoFacebook}>
                    <Icon name="logo-facebook" />
                  </Button>
                  <Button style={styles.logoGoogle}>
                    <Icon name="logo-google" />
                  </Button>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text>Do not have an account? </Text>
                  <Button
                      transparent
                      style={styles.transparentButton}
                      textStyle={{ lineHeight: (Platform.OS === 'ios') ? 15 : 18, textDecorationLine: 'underline' }}
                      onPress={() =>  this.replaceRoute('signup')}
                  >
                    <Text style={styles.signUpHereText}>Sign up here</Text>
                  </Button>
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

export default connect(mapStateToProps, bindActions)(Login);
