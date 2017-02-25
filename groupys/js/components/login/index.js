
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';


const {
  replaceAt,
} = actions;

const logo = require('../../../images/logo.png');
import login from './login-theme';
import styles from './styles';

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
        phoneNumber: '',
      password: '',
      scroll: false,
        error:''
    };
  }

  login() {
      console.log("try to login");
      this.replaceRoute('home');
      // fetch('http://low.la:9000/auth/local', {
      //     method: 'POST',
      //     headers: {
      //         'Accept': 'application/json, text/plain, */*',
      //         'Content-Type': 'application/json;charset=utf-8',
      //     },
      //     body: JSON.stringify({
      //         email:  this.state.phoneNumber + "@low.la",
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
                <View style={styles.inputContainer}>
                  <View style={{ marginBottom: 20 }}>
                    <InputGroup>
                      <Icon name="ios-phone-portrait-outline" style={{color:"#00f"}}/>
                      <Input
                          keyboardType="phone-pad"
                          placeholderTextColor='#444'
                          placeholder="Phone"
                          onChangeText={email => this.setState({ email })}
                      />
                    </InputGroup>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <InputGroup >
                      <Icon name="ios-unlock-outline" style={{color:"#00f"}}/>
                      <Input
                          placeholder="Password"
                          placeholderTextColor='#444'
                          secureTextEntry
                          onChangeText={password => this.setState({ password })}
                      />
                    </InputGroup>
                  </View>

                  <Button transparent style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot Login details?</Text>
                  </Button>
                  <Button style={styles.login} onPress={() => this.login( { phoneNumber: this.state.phoneNumber, password: this.state.password }) }>
                    <Text>Login</Text>
                  </Button>
                  <Text>
                      {this.state.error}
                  </Text>
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
