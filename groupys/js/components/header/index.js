
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform} from 'react-native';
import {  View, Button, InputGroup,Tabs,Tab,TabHeading,Input,Text,Header } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';

import styles from './styles';
// import Icon from 'react-native-vector-icons/Ionicons';

import ContactApi from '../../api/contacts'
let contactApi = new ContactApi();
import Icon from 'react-native-vector-icons/SimpleLineIcons';


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

                borderBottomColor: 'white',

                borderStyle:'solid',
                backgroundColor: 'white',
                borderBottomWidth:0.5,
                paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                justifyContent: 'space-between',
            }}
        >
      <View style={styles.header} >

          <View style={{ flexDirection: 'row', alignItems: 'stretch' ,justifyContent: 'space-between' }}>
                <Button transparent style={{ marginLeft:20,paddingRight: 15 }} onPress={this.props.openDrawer}>
                    <Icon active color={"#2db6c8"} size={20} name="menu" />

                </Button>


              <Text transparent style={{ paddingRight: 20, paddingTop: 10,color:"#2db6c8" ,backgroundColor: 'transparent'}} >ThisCounts</Text>
          </View>




      </View>


        </Header>
    );
  }
}


