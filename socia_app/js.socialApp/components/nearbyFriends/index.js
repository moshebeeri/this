
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content, Button, Icon, Thumbnail, Footer, FooterTab, Title } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;

const chatContactsImg = require('../../../images/chatcontacts.png');
const profileImg = require('../../../images/profile.png');
const roger = require('../../../images/Roger-Federer.png');
const ferrari = require('../../../images/ferrari.png');
const rossi = require('../../../images/Valentino-Rossi.png');
const lamborghini = require('../../../images/lamborghini.png');

const {
  popRoute,
  pushRoute,
} = actions;

class Settings extends Component {  // eslint-disable-line

  static propTypes = {
    popRoute: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = { text: 'Search' };
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container theme={theme} style={{backgroundColor: '#fff'}}>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon style={styles.backBtn} name="ios-arrow-back" />
          </Button>

          <Title style={styles.header}>Nearby Friends</Title>

          <Button transparent onPress={this.props.openDrawer}>
            <Image source={chatContactsImg} style={{ resizeMode: 'contain', height: 30, width: 30 }} />
          </Button>
        </Header>
        <Content>

          <View style={styles.firstContainer}>
            <View style={styles.searchContainer}>
              <Icon name={'ios-search'} style={styles.searchIcon} />
              <TextInput
                style={{height: 40, borderWidth: 0, flex: 1, paddingLeft: 10, marginTop: 2, color: 'rgba(0,0,0,0.3)'}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                editable={true}
              />
            </View>
            <View style={styles.inviteContainer}>
              <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Icon name='ios-people' style={{color: primary, fontSize: 25, marginTop: 7}} />
                <Text style={{color: primary, fontSize: 16, marginLeft: 10, marginTop: 10}}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.largeDivider}>
            <Text>YOUR LOCATION</Text>
          </View>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail circle size={60} source={profileImg} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Aditya Thakur</Text>
              <Text style={styles.viewProfileText}>BTM 2nd Stage</Text>
            </View>
            <Icon name="ios-options" style={styles.arrowForward} />
          </TouchableOpacity>

          <View style={styles.largeDivider}>
            <Text>NEARBY</Text>
          </View>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail circle size={60} source={roger} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Roger Federer</Text>
              <Text style={styles.viewProfileText}>BTM 2nd Stage, 5 min</Text>
            </View>
            <Icon name="ios-hand" style={styles.arrowForward} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail circle size={60} source={ferrari} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Enzo Ferrari</Text>
              <Text style={styles.viewProfileText}>Banerghatta, 20 min</Text>
            </View>
            <Icon name="ios-hand" style={styles.arrowForward} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail circle size={60} source={rossi} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>The Doctor</Text>
              <Text style={styles.viewProfileText}>Italy, 1 day</Text>
            </View>
            <Icon name="ios-hand" style={styles.arrowForward} />
          </TouchableOpacity>

          <View style={styles.smallDivider}>
            <Text style={{alignSelf: 'center', color: 'rgba(0,0,0,0.3)'}}>See More</Text>
          </View>

          <View style={styles.largeDivider}>
            <Text>Friends Travelling</Text>
          </View>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail circle size={60} source={lamborghini} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Ferrucio Lamborghini</Text>
              <Text style={styles.viewProfileText}>Italy, 1 day</Text>
            </View>
            <Icon name="ios-hand" style={styles.arrowForward} />
          </TouchableOpacity>

        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={() => this.navigateTo('home')}>
              <Icon name="ios-calendar" />
            </Button>
            <Button onPress={() => this.navigateTo('friends')}>
              <Icon name="ios-people" />
            </Button>
            <Button>
              <Icon name="ios-chatboxes" />
            </Button>
            <Button onPress={() => this.navigateTo('notifications')}>
              <Icon name="ios-notifications" />
            </Button>
            <Button onPress={() => this.navigateTo('settings')}>
              <Icon name="ios-settings" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Settings);
