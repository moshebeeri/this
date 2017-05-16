
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail,CheckBox} from 'native-base';


import {actions} from 'react-native-navigation-redux-helpers';

import navigateTo from '../../../actions/sideBarNav';
import store from 'react-native-simple-store';


export default class SelectUsersComponent extends Component {

    constructor(props) {
        super(props);

        let selectCheckBox = this.props.navigation.state.params.users.map(function (user) {
            return false
        });
        this.state = {

            users:this.props.navigation.state.params.users,
            selectCheckBox: selectCheckBox


        };


    }
    selectCheckBox(index){
        let selectCheckBoxes = this.state.selectCheckBox;
        selectCheckBoxes[index] = !this.state.selectCheckBox[index];

        this.setState({
            selectCheckBox: selectCheckBoxes
        })
    }

    saveFormData(){
        let selectedUsers = new Array();

        let selectedBool = this.state.selectCheckBox;
        this.state.users.forEach(function (user,i) {
            if(selectedBool[i + 1]) {
                selectedUsers.push(user);
            }

        })

        this.props.navigation.state.params.selectUsers(selectedUsers);
        this.props.navigation.goBack();

    }


    render() {
        let index = 0;
        let productsRows = this.state.users.map((r, i) => {
            index++;

            if(r.picture){
                return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)} thumbnail>
                  <Left>

                      <Thumbnail square size={80} source={{uri: r.picture}} />
                  </Left>
                  <Body>
                  <Text>{r.name}</Text>
                  <Text note>{r.phone}</Text>
                  </Body>
                  <Right>

                      <CheckBox  onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
                  </Right>
                </ListItem>
            }
            return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)}  thumbnail style={{  backgroundColor: '#fff'}}>
              <Left>
                  <Thumbnail square size={80} source={require('../../../../images/client_1.png')} />
              </Left>
              <Body>

              <Text>{r.name}</Text>
              <Text note>{r.phone}</Text>
              </Body>
              <Right>
                  <CheckBox onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
              </Right>
            </ListItem>
        });
        return ( <Container>
              <Content  style={{  backgroundColor: '#fff'}}>


                  { productsRows }

              </Content>
                <Footer>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Select Users</Text>
                    </Button>
                </Footer>
            </Container>


        );
  }
}

