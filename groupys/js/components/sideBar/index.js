
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { View, Text, Icon, List, ListItem, Content } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import theme from '../../themes/base-theme';
import styles from './style';

const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');

class SideBar extends Component {

  static propTypes = {
    navigateTo: React.PropTypes.func,
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Content theme={theme} style={{ backgroundColor: '#fff' }} >
        <Image style={styles.image} source={cover} >
          <Image style={styles.thumbnail} source={profile} />
          <Text style={[styles.name, { top: 120 }]}>John Doe </Text>
          <Text style={[styles.name, { top: 140 }]}>$ 500, Strap Sale Credit </Text>
        </Image>

        <Text style={{ color: '#000', fontSize: 16, margin: 20, fontWeight: '500', marginBottom: 10 }}>Shop by Category </Text>
        <List foregroundColor={'#000'} style={styles.list}>
          <ListItem button onPress={() => this.navigateTo('business')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#00afc1', paddingLeft: 11 }]}>
                <Icon name="ios-phone-portrait" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText} >Business</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('from_with_image')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#00afc1', paddingLeft: 11 }]}>
                <Icon name="ios-phone-portrait" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText} >Form With Image</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('cart')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#ab6aed' }]}>
                <Icon name="ios-shirt" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText}>Fashion & Lifestyle</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('product')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#eb6b23', paddingLeft: 8 }]}>
                <Icon name="ios-cut" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText}>Home & Living</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('product')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#29783b' }]}>
                <Icon name="ios-construct" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText}>Daily Needs</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('product')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#4dcae0' }]}>
                <Icon name="ios-car" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText}>Motors & Accessories</Text>
            </View>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('profile')} iconLeft style={styles.links} >
            <View style={styles.sidebarList}>
              <View style={[styles.sidebarIconView, { backgroundColor: '#f5bf35', paddingLeft: 9 }]}>
                <Icon name="ios-copy" style={styles.sidebarIcon} />
              </View>
              <Text style={styles.linkText}>Books, Media & Music</Text>
            </View>
          </ListItem>
        </List>
        <List foregroundColor={'#000'} style={{ paddingTop: 10 }}>
          <ListItem button onPress={() => this.navigateTo('profile')} style={styles.links2} >
            <Text style={styles.linkText}>Profile</Text>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('track')} style={styles.links2} >
            <Text style={styles.linkText}>Track Order</Text>
          </ListItem>
          <ListItem button onPress={() => this.navigateTo('notification')} style={styles.links2} >
            <Text style={styles.linkText}>My Notifications</Text>
          </ListItem>
        </List>
      </Content>
    );
  }
}

function bindAction(dispatch) {
  return {
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SideBar);
