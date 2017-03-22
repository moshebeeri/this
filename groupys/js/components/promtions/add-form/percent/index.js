
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import CheckBox from 'react-native-check-box'
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';
import AddFormHeader from '../../../header/addFormHeader';

import styles from './styles';

const {
    replaceAt,
} = actions;


class PercentComponent extends Component {

    constructor(props) {
        super(props);

    }

    setPercent(value){
        this.props.setState(
            {
                percent: {
                    percent: value
                }
            }

        )
    }

    render() {
       return  <Item underline>
           <Input onChangeText={(value) => this.setPercent({value})} placeholder='%Precent' />
       </Item>
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

export default connect(mapStateToProps, bindAction)(PercentComponent);
