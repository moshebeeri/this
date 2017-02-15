
import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';

import login from './login-theme';
import styles from './styles';
//import AlertContainer from 'react-alert';
const {
  replaceAt,
} = actions;

const logo = require('../../../images/logo.png');

class Login extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
        phoneNumber: '',
      password: '',
      scroll: false,
        error:''
    };
  }

  login() {
      console.log("try to login");
      this.replaceRoute('home')
      // fetch('http://low.la:9000/auth/local', {
      //     method: 'POST',
      //     headers: {
      //         'Accept': 'application/json, text/plain, */*',
      //         'Content-Type': 'application/json;charset=utf-8',
      //     },
      //     body: JSON.stringify({
      //         email:  this.state.phoneNumber + "@lowla.co.il",
      //         password:this.state.password,
      //     })
      // }).then(function (response) {
      //     console.log(response._bodyText);
      //     console.log(response.status);
      //     this.replaceRoute('home')
      // }).catch(function (error) {
      //         console.log('There has been a problem with your fetch operation: ' + error.message);
      //     });




  }
  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  render() {
    return (
      <Container>
        <Content theme={login} style={{ backgroundColor: login.backgroundColor }} >
          <Image source={logo} style={styles.shadow} />
          {/*<div>*/}
            {/*<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />*/}
            {/*<button onClick={this.showAlert}>Show Alert</button>*/}
          {/*</div>*/}
          <View style={styles.inputContainer}>
            <View style={{ marginBottom: 20 }}>
              <InputGroup>
                <Icon name="ios-person" />
                <Input
                  placeholder="Phone"
                  onChangeText={email => this.setState({ email })}
                />
              </InputGroup>
            </View>

            <View style={{ marginBottom: 20 }}>
              <InputGroup >
                <Icon name="ios-unlock-outline" />
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                />
              </InputGroup>
            </View>

            <Button transparent style={styles.forgot} textStyle={{ fontSize: 14, textDecorationLine: 'underline' }}>
                    Forgot Login details?
            </Button>
            <Button style={styles.login} onPress={() => this.login( { phoneNumber: this.state.phoneNumber, password: this.state.password }) }>
                Login
            </Button>
              <Text>
                  {this.state.error}
              </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 }}>
            <Button style={[styles.logoButton, { backgroundColor: '#3541A9' }]}>
              <Icon name="logo-facebook" />
            </Button>
            <Button style={[styles.logoButton, { backgroundColor: '#b63a48' }]}>
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
              Sign up here
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
