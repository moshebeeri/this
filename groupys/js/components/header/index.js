
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform} from 'react-native';
import { Icon, View, Button, InputGroup,Tabs,Tab,TabHeading,Input,Text,Header } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';

import styles from './styles';
import ContactApi from '../../api/contacts'
let contactApi = new ContactApi();



export default class GeneralComponentHeader extends Component {


    constructor(props) {
        super(props);


    }



    refreshContact(){
        contactApi.syncContacts();
    }

    realize(){
        this.props.navigate('realizePromotion')
    }

    render() {



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




              </View>
              <Text transparent style={{ paddingRight: 20, paddingTop: 10, backgroundColor: 'transparent'}} >Groupies</Text>
          </View>


      </View>


        </Header>
    );
  }
}


