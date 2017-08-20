
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, Fab,InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as userAction from "../../actions/user";
const noPic = require('../../../images/client_1.png');
import EntityUtils from "../../utils/createEntity";
import store from 'react-native-simple-store';
import LoginApi from '../../api/login'

let loginApi = new LoginApi();
class ChangePassword extends Component {

      constructor(props) {

        super(props);
          this.state = {
              currentPassword:'',
              newPassword:'',
              showMessage:false,
              validationMessage:'',
              token:''
          }
          let stateFunc = this.setState.bind(this);
          store.get('token').then(storeToken => {
              stateFunc({
                      token: storeToken
                  }
              );
          });
      }

   async componentWillMount() {




    }




   async save() {
       try {
           this.setState({
               showMessage:false
           })
           let response =  await loginApi.changePassword(this.state.currentPassword, this.state.newPassword, this.props.user.user._id,)
            if(response == true){
                this.props.navigation.goBack();
            }
            console.log(response)
       }catch (response){
           this.setState({
               validationMessage:'Failed to Authenticate Current Password',
               showMessage:true
           })
       }
   }

    formFailed(){
        console.log('failed')

    }
    render() {




        if(!this.props.user.user){
              return <Container></Container>
          }
        let message = undefined
        if(this.state.showMessage){
           message = <Text style={{ fontSize: 16,
              color:'red',}}>{this.state.validationMessage}</Text>
        }
        return (
            <Container style={{flex:-1,backgroundColor: '#fff'}}>
                <Content  style={{margin:10,backgroundColor: '#fff'}}>



                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(currentPassword) => this.setState({currentPassword})} placeholder='Current Password' />
                        </Item>


                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.phone_number} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(newPassword) => this.setState({newPassword})} placeholder='New Password' />
                        </Item>

                    {message}


                </Content>
                <Footer style={{backgroundColor: '#fff'}}>
                    <Button transparent
                            onPress={this.save.bind(this)}
                    >
                        <Text>Change Password</Text>
                    </Button>

                </Footer>

            </Container>
        );
    }



}

export default connect(
    state => ({
        user: state.user
    }),
    dispatch => bindActionCreators(userAction, dispatch)
)(ChangePassword);


