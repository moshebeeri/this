
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform} from 'react-native';
import { Icon, View, Button, InputGroup,Tabs,Tab,TabHeading,Input,Text,Header } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../actions/drawer';
import navigateTo from '../../actions/sideBarNav';

import styles from './styles';

const {
    replaceAt,
} = actions;


class GeneralComponentHeader extends Component {
    constructor(props) {
        super(props);


    }

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }


    replaceRoute(route) {
        this.props.replaceAt(this.props.current, {key: route}, this.props.navigation.key);
    }


    render() {
      let action = undefined;
      if(this.props.showAction && this.props.showAction==true){
          action =  <Button style={{ backgroundColor: 'transparent'}} iconLeft light>

              <Icon style = {{width:20,backgroundColor: 'transparent'}} name='create'  onPress={() =>  this.replaceRoute(this.props.to)}  />
          </Button>;
      }


    return (
        <Header
            style={{ flexDirection: 'column',
                height: 60,
                elevation: 0,

                borderBottomColor: 'gray',

                borderStyle:'solid',
                backgroundColor: '#fff',
                borderBottomWidth:0.5,
                paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                justifyContent: 'space-between',
            }}
        >
      <View style={styles.header} >
          <View style={{ flexDirection: 'row', alignItems: 'stretch' ,justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'stretch' ,justifyContent: 'flex-start' }}>
                <Button transparent style={{ paddingRight: 15 }} onPress={this.props.openDrawer}>
                  <Icon name="menu" />
                </Button>
                  {action}

              </View>
              <Text transparent style={{ paddingRight: 20, paddingTop: 10, backgroundColor: 'transparent'}} >Groupies</Text>
          </View>


      </View>


        </Header>
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

export default connect(mapStateToProps, bindAction)(GeneralComponentHeader);
