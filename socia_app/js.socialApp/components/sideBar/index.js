
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View } from 'react-native';
import { Container, Content, Text, Icon, List, ListItem, Thumbnail, InputGroup, Input, Button } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import styles from './style';

const profileImg = require('../../../images/profile.png');
const locationImg = require('../../../images/nearby.png');
const settingsDarkImg = require('../../../images/settings-dark.png');
const valentinoRossiImg = require('../../../images/Valentino-Rossi.png');
const rogerFedererImg = require('../../../images/Roger-Federer.png');
const ferrariImg = require('../../../images/ferrari.png');
const lamborghiniImg = require('../../../images/lamborghini.png');


const userData = [
  {
    thumbnail: profileImg,
    name: 'Aditya Thakur',
    content: 'View Profile',
    link: 'profile',
  },
  {
    thumbnail: locationImg,
    name: 'Aditya Thakur',
    content: 'Who is near you',
    link: 'nearbyFriends',
  },
];

class SideBar extends Component {

  static propTypes = {
    navigateTo: React.PropTypes.func,
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container>
        <Content style={styles.drawerContent}>

          <View style={styles.header} >
            <View style={styles.rowHeader}>
              <InputGroup style={styles.sidebarSearch}>
                <Icon name="ios-search" style={styles.searchIcon} />
                <Input placeholder="Search" style={styles.placeholder} />
              </InputGroup>
              <Button transparent>
                <Image source={settingsDarkImg} style={styles.settingsBtn} />
              </Button>
            </View>
          </View>


          <List
            dataArray={userData}
            renderRow={userDataRow =>
              <ListItem
                button
                onPress={() => this.navigateTo(userDataRow.link)}
                style={styles.links}
              >
                <Thumbnail square size={50} source={userDataRow.thumbnail} />
                <View style={styles.profileTextBlock}>
                  <Text style={styles.profileName}>{userDataRow.name}</Text>
                  <Text style={styles.viewProfileLink}>{userDataRow.content}</Text>
                </View>
                <Icon name="ios-arrow-forward" style={styles.arrowForward} />
              </ListItem>
            }
          />


          <View style={styles.favHead}>
            <Text style={styles.favText}>FAVOURITES</Text>
            <Text style={styles.favText}>EDIT</Text>
          </View>


          <List foregroundColor={'white'} >
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={ferrariImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Enzo Ferrari</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={lamborghiniImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Feruccio</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={[styles.links, { borderBottomWidth: 0 }]}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
          </List>


          <View style={styles.favHead}>
            <Text style={styles.favText}>MORE FRIENDS (27)</Text>
          </View>


          <List foregroundColor={'white'} >
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={ferrariImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Enzo Ferrari</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={lamborghiniImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Feruccio</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={[styles.links, { borderBottomWidth: 0 }]}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={ferrariImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Enzo Ferrari</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={lamborghiniImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Mr. Feruccio</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={styles.links}
            >
              <Thumbnail square size={50} source={valentinoRossiImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Valentino Rossi</Text>
              </View>
              <Icon name="ios-phone-portrait" style={[styles.arrowForward, { fontSize: 25 }]} />
            </ListItem>
            <ListItem
              button
              style={[styles.links, { borderBottomWidth: 0 }]}
            >
              <Thumbnail square size={50} source={rogerFedererImg} />
              <View style={[styles.profileTextBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={[styles.profileName, { marginTop: 8 }]}>Roger Federer</Text>
              </View>
              <View style={styles.online} />
            </ListItem>
          </List>


          <View style={styles.favHead}>
            <Text style={styles.favText}>options</Text>
          </View>


          <List foregroundColor={'white'} >
            <ListItem
              button iconLeft
              onPress={() => this.navigateTo('userSettings')}
              style={styles.links}
            >
              <Icon name="ios-settings" />
              <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem>
            <ListItem
              button iconLeft
              onPress={() => this.navigateTo('home')}
              style={styles.links}
            >
              <Icon name="ios-grid-outline" />
              <Text style={styles.linkText} >HOME</Text>
            </ListItem>

            <ListItem
              button iconLeft
              onPress={() => this.navigateTo('blankPage')}
              style={styles.links}
            >
              <Icon name="ios-keypad-outline" />
              <Text style={styles.linkText}>BLANK PAGE</Text>
            </ListItem>
            <ListItem
              button iconLeft
              onPress={() => this.navigateTo('login')}
              style={styles.links}
            >
              <Icon name="ios-power" />
              <Text style={styles.linkText}>LOG OUT</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
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
