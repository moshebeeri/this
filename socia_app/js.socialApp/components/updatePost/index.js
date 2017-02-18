
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Text, TextInput } from 'react-native';
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

  constructor(props) {
    super(props);
    this.state = { text: 'Whats on your mind?' };
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

          <Title style={styles.header}>Update Status</Title>

          <Button transparent onPress={() => this.popRoute()}>
            <Text style={styles.postBtn}>Post</Text>
          </Button>
        </Header>
        <Content style={{borderBottomWidth: 1, borderBottomColor: '#C8C7CC'}}>

          <TouchableOpacity style={styles.nameContainer}>
            <Thumbnail square size={60} source={profileImg} />
            <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>Aditya Thakur</Text>
              <Text style={styles.viewProfileText}>Public</Text>
            </View>
          </TouchableOpacity>

          <View style={{backgroundColor: '#fff', padding: 20}}>
            <TextInput
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              style={{height: 160, borderWidth: 0, fontSize: 20, color: 'rgba(0,0,0,0.5)'}}
              editable={true}
              multiline = {true}
              numberOfLines = {10}
            />
          </View>

          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={styles.iconContainer}>
                <Icon name="ios-camera" style={[styles.optionIcon,{color: '#89BD4F'}]} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Photo/Video</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={styles.iconContainer}>
                <Icon name="ios-videocam" style={[styles.optionIcon,{color: '#FE2742'}]} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Live Video</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={styles.iconContainer}>
                <Icon name="ios-pin" style={[styles.optionIcon,{color: '#F3166D'}]} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Check In</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={styles.iconContainer}>
                <Icon name="ios-happy" style={[styles.optionIcon,{color: '#F4C13B'}]} />
              </View>
              <View style={styles.optionBlock}>
                <Text style={styles.option}>Feeling/Activity</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section2}>
            <View style={styles.optionsContainer}>
              <View style={styles.iconContainer}>
                <Icon name="ios-people" style={[styles.optionIcon,{color: '#5691FE'}]} />
              </View>
              <View style={[styles.optionBlock,{borderBottomWidth: 0}]}>
                <Text style={styles.option}>Tag Friends</Text>
              </View>
            </View>
          </TouchableOpacity>

        </Content>
      
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
