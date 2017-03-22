
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


class PercentRangeComponent extends Component {

    constructor(props) {
        super(props);

    }


    setPercentFrom(value){
        this.props.setState(
            {
                percent_range: {
                    to: this.state.percent_range.to,
                    from: value
                }
            }

        )
    }
    setPercentTo(value){
        this.props.setState(
            {
                percent_range: {
                    to: value,
                    from:this.state.percent_range.from,
                }
            }

        )
    }

    render() {
       return  <View>
           <Item underline>
               <Input onChangeText={(value) => this.setPercentFrom({value})} placeholder=' from %Precent' />
           </Item>
           <Item underline>
               <Input onChangeText={(value) => this.setPercentTo({value})} placeholder=' to %Precent' />
           </Item>
       </View>
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

export default connect(mapStateToProps, bindAction)(PercentRangeComponent);
