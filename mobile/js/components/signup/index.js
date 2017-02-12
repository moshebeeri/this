
import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';

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
    this.state = {
      email: '',
      password: '',
      scroll: false,
        error:''
    };
  }

  signup() {
      console.log("try to sigunp");

      fetch('http://low.la:9000/auth/local', {
          method: 'POST',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
              email: this.state.email,
              password:this.state.password,
          })
      }).then(function (response) {
          console.log(response._bodyText);
          console.log(response.status);
          this.replaceRoute('home', {email: this.state.email, password: this.state.password})
      }).catch(function (error) {
              console.log('There has been a problem with your fetch operation: ' + error.message);
          });




  }
  replaceRoute(route) {
    this.props.replaceAt('Signup', { key: route }, this.props.navigation.key);
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


            <Button style={styles.login} onPress={() => this.signup({ email: this.state.email, password: this.state.password }) }>
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
