
import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, View, List, ListItem, Radio } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import signup from './signup-theme';
import styles from './styles';

const {
  replaceAt,
} = actions;

const logo = require('../../../images/logo.png');

class SignUp extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      surname: '',
      mobileoremail: '',
      reentermobileoremail: '',
      password: '',
    };
    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
  }

  replaceRoute(route) {
    this.props.replaceAt('signup', { key: route }, this.props.navigation.key);
  }

  render() {
    return (
      <Container style={styles.background}>
        <Content theme={signup}>
          <View style={styles.bg}>
            <View style={styles.topSection}>
              <Image source={logo} style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />
            </View>
            <View style={{ padding: 40, paddingTop: 40 }}>
              <Grid style={{ marginBottom: 20 }}>
                <Col style={{ paddingRight: 10 }}>
                  <InputGroup borderType="underline" style={styles.inputGrp}>
                    <Input
                      placeholder="First Name"
                      onChangeText={firstname => this.setState({ firstname })}
                      style={styles.input}
                    />
                  </InputGroup>
                </Col>
                <Col style={{ paddingLeft: 10 }}>
                  <InputGroup borderType="underline" style={styles.inputGrp}>
                    <Input
                      placeholder="Surname"
                      onChangeText={surname => this.setState({ surname })}
                      style={styles.input}
                    />
                  </InputGroup>
                </Col>
              </Grid>
              <InputGroup borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Mobile number or email address"
                  onChangeText={mobileoremail => this.setState({ mobileoremail })}
                  style={styles.input}
                />
              </InputGroup>
              <InputGroup borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Re-enter mobile number or email address"
                  onChangeText={reentermobileoremail => this.setState({ reentermobileoremail })}
                  style={styles.input}
                />
              </InputGroup>
              <InputGroup borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="New password"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  style={styles.input}
                />
              </InputGroup>
              <Grid>
                <Col>
                  <List>
                    <ListItem
                      style={{ padding: 0, paddingRight: 15, marginLeft: 0, borderBottomWidth: 0 }}
                    >
                      <Radio selected={false} />
                      <Text>Female</Text>
                    </ListItem>
                  </List>
                </Col>
                <Col>
                  <List>
                    <ListItem
                      style={{ padding: 0, paddingLeft: 15, marginLeft: 0, borderBottomWidth: 0 }}
                    >
                      <Radio selected />
                      <Text>Male</Text>
                    </ListItem>
                  </List>
                </Col>
              </Grid>
              <Button
                block
                style={styles.createBtn}
                textStyle={Platform.OS === 'android' ? { marginTop: -5, fontSize: 16 } : { fontSize: 16, marginTop: -5, fontWeight: '900' }}
                onPress={() => this.replaceRoute('home', { username: this.state.username, password: this.state.password })}
              >
                <Text style={{ lineHeight: 16, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>CREATE</Text>
              </Button>
              <Button
                transparent
                onPress={() => this.replaceRoute('login')}
                style={{ alignSelf: 'flex-end', marginTop: 10 }}
              >
                <Text style={styles.forgotPassword}>
                      Sign In
                  </Text>
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

export default connect(mapStateToProps, bindActions)(SignUp);
