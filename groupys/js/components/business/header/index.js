
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, View, Button, InputGroup, Input,Text } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../actions/drawer';
import navigateTo from '../../../actions/sideBarNav';

import styles from './styles';

const {
    replaceAt,
} = actions;


class BusinessHeader extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }


    replaceRoute(route) {
        this.props.replaceAt('business', {key: route}, this.props.navigation.key);
    }


    render() {
    return (
      <View style={styles.header} >
          <View style={{ flexDirection: 'row', alignItems: 'stretch' ,justifyContent: 'space-between' }}>
            <Button transparent style={{ paddingRight: 15 }} onPress={this.props.openDrawer}>
              <Icon name="ios-menu" />
            </Button>

            <Button style={{ backgroundColor: 'transparent'}} iconLeft light>

              <Icon name='md-person-add'  onPress={() =>  this.replaceRoute('add-business')}  />
            </Button>


          </View>

      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
      replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    openDrawer: () => dispatch(openDrawer()),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(BusinessHeader);
