
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content, Button, Icon, Thumbnail, Footer, FooterTab, Title, List, ListItem } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const {
  popRoute,
  pushRoute,
} = actions;

const rogerFedererImg = require('../../../images/Roger-Federer.png');
const valentinoRossiImg = require('../../../images/Valentino-Rossi.png');
const ferrariImg = require('../../../images/ferrari.png');
const lamborghiniImg = require('../../../images/lamborghini.png');
const coverImg = require('../../../images/cover.png');
const profileImg = require('../../../images/profile.png');
const chatContactsImg = require('../../../images/chatcontacts.png');

const data = [
  {
    thumbnail: rogerFedererImg,
    post: 'Alfa and Beta also commented on Omegas photo.',
    time: '5 min ago',
  },
  {
    thumbnail: valentinoRossiImg,
    post: 'Valentino Rossi wins the MotoGP Premier 2016.',
    time: '6 min ago',
  },
  {
    thumbnail: ferrariImg,
    post: 'Messi once again crowned the Ballon Dor.',
    time: '10 min ago',
  },
  {
    thumbnail: lamborghiniImg,
    post: 'Avantador is fast. Really fast',
    time: '12 min ago',
  },
  {
    thumbnail: coverImg,
    post: 'It was a beautiful sunset.',
    time: '20 min ago',
  },
  {
    thumbnail: profileImg,
    post: 'This is me',
    time: '1 day',
  },
];

class Notifications extends Component {  // eslint-disable-line

  static propTypes = {
    popRoute: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
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

          <Title style={styles.header}>Notifications</Title>

          <Button transparent onPress={this.props.openDrawer}>
            <Image source={chatContactsImg} style={{ resizeMode: 'contain', height: 30, width: 30 }} />
          </Button>
        </Header>
        <Content>
          <List
            dataArray={data}
            renderRow={dataRow =>
              <ListItem>
                <TouchableOpacity style={styles.notificationContainer}>
                  <Thumbnail square size={70} source={dataRow.thumbnail} />
                  <View style={styles.textBlock}>
                    <Text style={styles.head}>{dataRow.post}</Text>
                    <Text style={styles.time}>{dataRow.time}</Text>
                  </View>
                </TouchableOpacity>
              </ListItem>
            }
          />
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
            <Button active>
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

export default connect(mapStateToProps, bindAction)(Notifications);
