
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content, Button, Icon, Thumbnail, Footer, FooterTab, Title } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const chatContactsImg = require('../../../images/chatcontacts.png');

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
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon style={styles.backBtn} name="ios-arrow-back" />
          </Button>

          <Title style={styles.header}>Settings</Title>

          
        </Header>
        <Content>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-settings" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>General</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-lock" style={styles.optionIcon} />
                </View>
                <View style={[styles.optionBlock,{borderBottomWidth: 0}]}>
                  <Text style={styles.option}>Security</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-lock-outline" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Privacy</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-pin" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Timeline and Tagging</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-globe-outline" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Location</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-videocam" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Videos and Photos</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-musical-notes" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Sounds</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-globe" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Browser</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-close-circle" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Blocking</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-globe-outline" style={styles.optionIcon} />
                </View>
                <View style={[styles.optionBlock,{borderBottomWidth: 0}]}>
                  <Text style={styles.option}>Language</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="md-globe" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Notifications</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-chatboxes" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Text Messaging</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-document" style={styles.optionIcon} />
                </View>
                <View style={[styles.optionBlock,{borderBottomWidth: 0}]}>
                  <Text style={styles.option}>Public Posts</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="md-apps" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Apps</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-chatbubbles" style={styles.optionIcon} />
                </View>
                <View style={styles.optionBlock}>
                  <Text style={styles.option}>Ads</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-card" style={styles.optionIcon} />
                </View>
                <View style={[styles.optionBlock, styles.bb0]}>
                  <Text style={styles.option}>Payments</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.section2}>
              <View style={styles.optionsContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="ios-help" style={styles.optionIcon} />
                </View>
                <View style={[styles.optionBlock,{borderBottomWidth: 0}]}>
                  <Text style={styles.option}>Support Inbox</Text>
                  <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

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
