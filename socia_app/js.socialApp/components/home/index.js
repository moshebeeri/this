
import React, { Component } from 'react';
import { Image, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content,
  Text, Button, Icon, InputGroup,
  Input, Grid, Col, Thumbnail,
  Footer, FooterTab, List, ListItem } from 'native-base';

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
const chatContactsImg = require('../../../images/chatcontacts.png');
const profileImg = require('../../../images/profile.png');
const notificationImg = require('../../../images/notification.png');
const likeImg = require('../../../images/like.png');
const commentImg = require('../../../images/comment.png');
const shareImg = require('../../../images/share.png');
const live = require('../../../images/live.png');
const photo = require('../../../images/cam.png');
const checkIn = require('../../../images/checkin.png');

const data = [
  {
    name: 'Roger Federer',
    time: '1 hr',
    content: 'Aenean ultricies semper eros. Nunc sed dignissim lectus. Pellentesque consectetur neque id commodo vestibulum. Sed ut libero in augue volutpat interdum eu a mauris. Nullam ac magna ornare, porttitor quam sit amet, suscipit orci. Vivamus ut erat eget turpis rutrum consectetur ac non arcu. Maecenas at mauris a urna egestas bibendum sit amet a neque. Ut nisl sapien, molestie a libero vitae, volutpat condimentum velit. Cras non bibendum mi, at commodo ex. Etiam accumsan ex ac orci consectetur, et fermentum risus facilisis. Proin feugiat quis mi ut eleifend. Pellentesque magna mi, sollicitudin quis ligula sed, tristique porta arcu. Duis metus diam, finibus eget odio eu, efficitur dignissim odio. Etiam eros nibh, dignissim vel malesuada sed, auctor et tortor. Pellentesque convallis, felis vel vestibulum faucibus, justo nibh faucibus lectus, ut tempus turpis risus ut arcu.',
    thumbnail: rogerFedererImg,
  },
  {
    name: 'Valentino Rossi',
    time: '2 hr',
    content: 'Aenean ultricies semper eros. Nunc sed dignissim lectus. Pellentesque consectetur neque id commodo vestibulum. Sed ut libero in augue volutpat interdum eu a mauris.',
    thumbnail: valentinoRossiImg,
  },
  {
    name: 'Enzo Ferrari',
    time: '1 day',
    content: '',
    thumbnail: ferrariImg,
  },
  {
    name: 'Ferruccio Lamborghini',
    time: '1 week',
    content: '',
    thumbnail: lamborghiniImg,
  },
];

class Home extends Component {  // eslint-disable-line

  static propTypes = {
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    popRoute: React.PropTypes.func,
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
        <Header searchBar>
          <View style={styles.header} >
            <View style={styles.rowHeader}>
              <InputGroup style={styles.searchInputGroup}>
                <Icon name="ios-search" style={styles.searchIcon} />
                <Input placeholder="Search" style={styles.inputBox} />
              </InputGroup>
              <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
                <Image source={chatContactsImg} style={styles.sidebarIcon} />
              </Button>
            </View>
          </View>
        </Header>

        <Content>
          <View style={styles.contentView}>
            <ScrollView>

              <View style={styles.detailsBlock}>
                <View style={styles.whatsOnMind}>
                  <Thumbnail size={60} square source={profileImg} />
                  <TouchableOpacity onPress={() => this.navigateTo('updatePost')}>
                    <Text style={styles.nameText}>What's on your mind?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.navLinks}>
                  <TouchableOpacity style={styles.navLinkBtn}>
                    <Image source={live} style={styles.navLinkIcons} />
                    <Text style={styles.navLinkText}>Live</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.navLinkBtn,{borderRightWidth: 1, borderLeftWidth: 1, borderLeftColor: 'rgba(0,0,0,0.1)', borderRightColor: 'rgba(0,0,0,0.1)'}]}>
                    <Image source={photo} style={styles.navLinkIcons} />
                    <Text style={styles.navLinkText}>Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navLinkBtn}>
                    <Image source={checkIn} style={styles.navLinkIcons} />
                    <Text style={styles.navLinkText}>Check In</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.listViewBlock}>
                <List
                  dataArray={data}
                  renderRow={dataRow =>
                    <ListItem>
                      <View style={styles.listItemView}>
                        <View style={{ flexDirection: 'row' }}>
                          <Thumbnail size={50} square source={dataRow.thumbnail} />
                          <View style={{ marginLeft: 10 }}>
                            <Text style={styles.userName}>{dataRow.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={{ fontSize: 18, color: '#95969B' }}>
                                {dataRow.time}
                              </Text>
                              <Image source={notificationImg} style={{ resizeMode: 'contain', height: 20, width: 20, marginLeft: 7, marginTop: 2}} />
                            </View>
                          </View>
                        </View>
                        <View style={{ marginTop: 10, flexWrap: 'wrap', overflow: 'hidden' }}>
                          <Text style={{ color: '#1B1C21' }}>
                            {dataRow.content}
                          </Text>
                        </View>
                        <Grid style={{ borderTopWidth: 1, borderTopColor: '#CFCFCF', paddingTop: 10, marginTop: 10 }}>
                          <Col style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{flexDirection: 'row'}}>
                              <Image source={likeImg} style={{ resizeMode: 'contain', height: 15, width: 15, marginRight: 5, marginTop: Platform.OS === 'android' ? 1 : -2 }} />
                              <Text style={{ color: '#9197A3', fontSize: 15, lineHeight: 15 }}>Like</Text>
                            </TouchableOpacity>
                          </Col>
                          <Col style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{flexDirection: 'row'}}>
                              <Image source={commentImg} style={{ resizeMode: 'contain', height: 15, width: 15, marginRight: 5, marginTop: Platform.OS === 'android' ? 3 : 0  }} />
                              <Text style={{ color: '#9197A3', fontSize: 15, lineHeight: 15 }}>Comment</Text>
                            </TouchableOpacity>
                          </Col>
                          <Col style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{flexDirection: 'row'}}>
                              <Image source={shareImg} style={{ resizeMode: 'contain', height: 15, width: 15, marginRight: 5, marginTop: Platform.OS === 'android' ? 2 : 0  }} />
                              <Text style={{ color: '#9197A3', fontSize: 15, lineHeight: 15 }}>Share</Text>
                            </TouchableOpacity>
                          </Col>
                        </Grid>
                      </View>
                    </ListItem>
                    }
                />
              </View>
            </ScrollView>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button active>
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

export default connect(mapStateToProps, bindAction)(Home);
