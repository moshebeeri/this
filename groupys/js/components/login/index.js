
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
import LoginApi from '../../api/login'
import ContactApi from '../../api/contacts'
import LoginUtils from '../../utils/login_utils'
import UserApi from '../../api/user'
let loginApi = new LoginApi()
let userApi = new UserApi()
let contactApi = new ContactApi();

let lu = new LoginUtils();

const global = require('../../conf/global')
let calc_login = true;
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
        token: false,
      scroll: false,
        error:''
    };
  }

  async login() {
      this.setState ({error: ''});
      try {

          let response = await loginApi.login(this.state.phoneNumber, this.state.password);
          if(response.token ){
              await userApi.getUser();
              contactApi.syncContacts();
              this.replaceRoute('home');
          }

      }catch (error){
          this.setState({
              error: error.error
          })
      }

  }
    calc_login_status() {
        return new Promise(async(resolve, reject) => {

            const _id = await store.get('user_id');
            if (!_id) {
                this.replaceRoute('login');
                return resolve(true);
            }
            try {
                const token = await lu.getToken();
                if (token) {
                    contactApi.syncContacts();
                    await userApi.getUser();
                    this.replaceRoute('home');
                    return resolve(true);
                }
            }catch(error){
                if(error == 'login'){
                    this.state.fingerprint_login = false;
                    this.state.recover_account = true;
                }
                else{
                    console.log('this.replaceRoute(\'error\') should go to error page');
                    this.replaceRoute('login');
                }
                return resolve(true);
            }
            return resolve(true);

        })
    }

    componentWillMount() {
        if(calc_login){

            this.calc_login_status();
            calc_login = false;
        }
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
