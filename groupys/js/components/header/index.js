
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform} from 'react-native';
import {  View, Button, InputGroup,Tabs,Tab,TabHeading,Input,Text,Header } from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';

import styles from './styles';
// import Icon from 'react-native-vector-icons/Ionicons';

import ContactApi from '../../api/contacts'
let contactApi = new ContactApi();
import Icon from 'react-native-vector-icons/Ionicons';

import Icon2 from 'react-native-vector-icons/SimpleLineIcons';

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
    back(){
        this.props.navigation.goBack();
    }

    render() {
        let back = undefined;
        if(this.props.showBack){
            back = <Button transparent style={{ }} onPress={()=> this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back" />

            </Button>
        }

    return (

        <Header
            style={{ flexDirection: 'column',
                height: 50,
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

          <View style={{ height:50,flexDirection: 'row' }}>
              {back}
                <Button transparent style={{  }} onPress={this.props.openDrawer}>
                    <Icon2 active color={"#2db6c8"} size={20} name="menu" />

                </Button>


              <Text transparent style={{ marginLeft:140,marginRight: 50, paddingTop: 10,color:"#2db6c8" ,backgroundColor: 'transparent'}} >ThisCounts</Text>
          </View>




      </View>


        </Header>
    );
  }
}


