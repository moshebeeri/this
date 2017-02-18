
import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, View } from 'native-base';

import login from './login-theme';
import styles from './styles';

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
      username: '',
      password: '',
    };
    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
  }

  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  render() {
    return (
      <Container style={styles.background}>
        <Content theme={login}>
          <View style={styles.bg}>
            <View style={styles.topSection}>
              <Image source={logo} style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />
            </View>
            <View style={{ padding: 40 }}>
              <InputGroup borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Email or Phone"
                  onChangeText={username => this.setState({ username })}
                  style={styles.input}
                />
              </InputGroup>
              <InputGroup borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  style={styles.input}
                />
              </InputGroup>
              <Button
                block
                style={styles.loginBtn}
                textStyle={Platform.OS === 'android' ? { marginTop: -5, fontSize: 16 } : { fontSize: 16, marginTop: -5, fontWeight: '900' }}
                onPress={() => this.replaceRoute('home')}
              >
                <Text style={{ lineHeight: 16, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>LOG IN</Text>
              </Button>
              <Button transparent style={{ alignSelf: 'center' }}>
                <Text style={styles.forgotPassword}>
                      Forgot Password?
                  </Text>
              </Button>
              <Button
                block bordered
                style={styles.createBtn}
                textStyle={Platform.OS === 'android' ? { marginTop: -5, fontSize: 16 } : { fontSize: 16, marginTop: -5, fontWeight: '900' }}
                onPress={() => this.replaceRoute('signup')}
              >
                <Text style={styles.createBtnTxt}>CREATE NEW SOCIAL ACCOUNT</Text>
              </Button>
            </View>
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
