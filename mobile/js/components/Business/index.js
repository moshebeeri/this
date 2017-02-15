
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Platform } from 'react-native';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem, Thumbnail } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import theme from '../../themes/base-theme';
import styles from './style';

const {
  popRoute,
} = actions;

const cartItem1 = require('../../../images/cart-item1.png');
const cartItem2 = require('../../../images/cart-item2.png');

class Business extends Component {

  static propTypes = {
    popRoute: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }


  addBusiness(){

  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
        <Header style={{ justifyContent: 'flex-start', paddingTop: (Platform.OS === 'ios') ? 23 : 9 }}>
          <Button transparent onPress={() => this.popRoute()} >
            <Icon name="ios-arrow-round-back-outline" style={{ fontSize: 30, lineHeight: 32, paddingRight: 10 }} />
             Business
          </Button>
        </Header>

        <Content padder style={{ backgroundColor: 'transparent' }}>
          <View style={{ flex: 0, marginButtom: 40}}>
          <Button  onPress={() => this.popRoute()} >
            Add Business
          </Button>
          </View>
          <Card foregroundColor="#000" style={styles.card} >
            <CardItem >
              <View style={styles.cardTop}>
                <Thumbnail source={cartItem1} size={100} square />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Text style={styles.descText}>
                   Shopping shmulik
                  </Text>

                </View>

              </View>
              <View style={styles.bottomDesc}>

                <Text style={{ color: theme.brandPrimary }}>Show Details</Text>
              </View>
            </CardItem>
          </Card>
          <Card foregroundColor="#000" style={styles.card}>
            <CardItem >
              <View style={styles.cardTop}>
                <Thumbnail source={cartItem2} size={100} square />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Text style={styles.descText}>
                    פיצוחים ציון
                  </Text>

                </View>

              </View>
              <View style={styles.bottomDesc}>

                <Text style={{ color: theme.brandPrimary }}>Show Details</Text>
              </View>
            </CardItem>
          </Card>

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Business);
