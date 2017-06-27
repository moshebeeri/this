
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, Fab,InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';

import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as userAction from "../../actions/user";
const noPic = require('../../../images/client_1.png');
class UserProfile extends Component {

      constructor(props) {

        super(props);
          this.state = {
              name:'',
              phone:'',
              email:''
          }

      }

    componentWillMount() {
          this.props.fetchUsers();
    }

    takePicture(){

    }

    save(){

    }

    render() {

          if(!this.props.user.user){
              return <Container></Container>
          }
        return (
            <Container style={{flex:-1,backgroundColor: '#fff'}}>
                <Card>
                    <CardItem>
                                <Image   style={{flex: 1,
                                    width: 200,
                                    height: 200,
                                    resizeMode: 'contain' }} source={noPic}>
                                    <Fab


                                        active={false}
                                        containerStyle={{ marginLeft: 5 }}
                                        style={{ backgroundColor: "#ffb3b3" }}
                                        position="bottomLeft"
                                        onPress={() => this.takePicture()}>
                                        <Icon size={10} name="camera" />


                                    </Fab>
                                </Image>

                    </CardItem>
                    <CardItem>
                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(name) => this.setState({name})} placeholder='Name' />
                        </Item>


                    </CardItem>
                    <CardItem>
                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.email} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(email) => this.setState({email})} placeholder='Email' />
                        </Item>

                    </CardItem>
                    <CardItem>
                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.phone} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(phone) => this.setState({phone})} placeholder='Phone' />
                        </Item>


                    </CardItem>



                </Card>

                <Footer style={{backgroundColor: '#fff'}}>
                    <Button transparent
                            onPress={this.save.bind(this)}
                    >
                        <Text>Save</Text>
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
)(UserProfile);


