
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
const profileImg = require('../../../images/profile.png');

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

          <Button transparent onPress={this.props.openDrawer}>
            <Image source={chatContactsImg} style={{ resizeMode: 'contain', height: 30, width: 30 }} />
          </Button>
        </Header>
        <Content>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail square size={60} source={profileImg} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Aditya Thakur</Text>
              <Text style={styles.viewProfileText}>View your Profile</Text>
            </View>
            <Icon name="ios-arrow-forward" style={styles.arrowForward} />
          </TouchableOpacity>

          <View style={styles.largeDivider} />

          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgBlue]}>
                <Icon name="ios-people" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Friends</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgRed]}>
                <Icon name="ios-calendar-outline" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Events</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgYellow]}>
                <Icon name="ios-people-outline" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Groups</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgGreen]}>
                <Icon name="ios-home-outline" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Shops</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgPink]}>
                <Icon name="ios-locate-outline" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Nearby Places</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgNavyBlue]}>
                <Icon name="ios-time" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>On this day</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgLightGreen]}>
                <Icon name="ios-american-football" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Sports</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgOrange]}>
                <Icon name="ios-flag" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Pages</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgNavyBlue]}>
                <Icon name="ios-calendar" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Feeds</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgNavyBlue]}>
                <Icon name="ios-list-box-outline" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Apps</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgNavyBlue]}>
                <Icon name="ios-ribbon" style={styles.optionIcon} />
              </View>
              <View style={[styles.optionBlock, styles.bb0]}>
                <Text style={styles.option}>Saved</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.largeDivider} />

          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgGrey]}>
                <Icon name="ios-lock" style={styles.optionIcon} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Privacy Shortcuts</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={[styles.iconContainer, styles.bgGrey]}>
                <Icon name="ios-help" style={styles.optionIcon} />
              </View>
              <View style={[styles.optionBlock, styles.bb0]}>
                <Text style={styles.option}>Help and Support</Text>
                <Icon name="ios-arrow-forward" style={styles.optionArrowForward} />
              </View>
            </View>
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
            <Button active>
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
