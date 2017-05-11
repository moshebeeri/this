
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


class AddFormHeader extends Component {



    constructor(props) {
        super(props);
        this.state = {
            refreshing: false

        }


    }


  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };




     replaceRoute(route) {
         if (this.state.refreshing)
             return
         this.setState({refreshing: true});
        this.props.replaceAt(this.props.currentLocation, {key: route}, this.props.navigation.key);
         this.setState({refreshing: false});
    }


    render() {
    return (

      <View style={styles.header} >
          <View style={{ flexDirection: 'row', alignItems: 'stretch'  }}>


            <Button ref="cancel" style={{ backgroundColor: 'transparent'}} iconLeft light onPress={() =>  this.replaceRoute(this.props.backLocation) }>
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

export default connect(mapStateToProps, bindAction)(AddFormHeader);
