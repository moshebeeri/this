
import React, { Component } from 'react';
import { View, Text } from 'react-native';
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

const img1 = require('../../../images/Roger-Federer.png');
const img2 = require('../../../images/Valentino-Rossi.png');
const img3 = require('../../../images/ferrari.png');
const img4 = require('../../../images/lamborghini.png');

const data = [
  {
    name: 'Roger Federer',
    friendsCount: '61 mutual friends',
    thumbnail: img1,
  },
  {
    name: 'Valentino Rossi',
    friendsCount: '20 mutual friends',
    thumbnail: img2,
  },
  {
    name: 'Enzo Ferrari',
    friendsCount: '48 mutual friends',
    thumbnail: img3,
  },
  {
    name: 'Ferruccio Lamborghini',
    friendsCount: '100 mutual friends',
    thumbnail: img4,
  },
];

class Friends extends Component {  // eslint-disable-line

  static propTypes = {
    popRoute: React.PropTypes.func,
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

          <Title style={styles.header}>Header</Title>

          <Button transparent>
            <Icon style={styles.addBtn} name="ios-add" />
          </Button>
        </Header>
        <Content>
          <Text style={styles.requestHead}>FRIEND REQUESTS</Text>
          <View style={styles.requestContainer}>
            <Text style={styles.whiteRequest}>No Friend Requests</Text>
          </View>
          <Text style={styles.requestHead}>PEOPLE YOU MAY KNOW</Text>
          <View style={styles.requestContainer}>
            <List
              dataArray={data}
              renderRow={dataRow =>
                <ListItem>
                  <View style={styles.requestContainerInner}>
                    <Thumbnail square size={75} source={dataRow.thumbnail} />
                    <View>
                      <Text style={styles.name}>{dataRow.name}</Text>
                      <Text style={styles.noOfMutualFriends}>{dataRow.friendsCount}</Text>
                      <View style={styles.actionButtonsBlock}>
                        <Button style={styles.friendBtn}> Add Friend </Button>
                        <Button bordered style={styles.friendBtn}> Remove </Button>
                      </View>
                    </View>
                  </View>
                </ListItem>
              }
            />
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={() => this.navigateTo('home')}>
              <Icon name="ios-calendar" />
            </Button>
            <Button active>
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

export default connect(mapStateToProps, bindAction)(Friends);
