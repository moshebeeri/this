
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Icon, View, Button, InputGroup, Input,Text } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';

import styles from './styles';

const {
    replaceAt,
} = actions;


class AddProductHeader extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }


    replaceRoute(route) {
        this.props.replaceAt('add-product', {key: route}, this.props.navigation.key);
    }


    render() {
    return (

      <View style={styles.header} >
          <View style={{ flexDirection: 'row', alignItems: 'stretch'  }}>


            <Button style={{ backgroundColor: 'transparent'}} iconLeft light onPress={() =>  this.replaceRoute('product') }>
              <Icon name="ios-arrow-back" />
              <Text> Cancel </Text>
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

export default connect(mapStateToProps, bindAction)(AddProductHeader);
