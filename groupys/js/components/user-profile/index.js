
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
let entityUtils = new EntityUtils();
class UserProfile extends Component {

      constructor(props) {

        super(props);
          this.state = {
              name:'',
              phone_number:'',
              email:'',
              image:'',
              path:'',
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
         if(this.props.user.user && this.props.user.user.pictures && this.props.user.user.pictures.length > 0){
             this.setState({
                 path:this.props.user.user.pictures[this.props.user.user.pictures.length -1].pictures[0],

             })
         }
          this.setState({
              name:this.props.user.user.name,
              phone_number:this.props.user.user.phone_number,

          })



    }

    async takePicture() {
        try {
            let image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                compressImageQuality: 0.5,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }





    save(){

        let user = {
            name:this.state.name,
            _id: this.props.user.user._id,
            email:this.state.email,
            image: this.state.image,
            phone_number:this.state.phone_number
        }
        entityUtils.update('users',user,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),'');
    }
    formSuccess(){
        this.props.fetchUsers();
        this.props.navigation.goBack();
    }
    formFailed(){
        console.log('failed')

    }
    render() {

        let image =
            <View><Image   style={{flex: 1,
            width: 200,
            height: 200,
            marginLeft:80,
            resizeMode: 'contain' }} source={noPic}>


        </Image>
                <Fab


                    active={false}
                    containerStyle={{ marginLeft: 30 }}
                    style={{ backgroundColor: "#ffb3b3" }}
                    position="bottomLeft"
                    onPress={() => this.takePicture()}>
                    <Icon size={10} name="camera" />


                </Fab>
            </View>
        if(this.state.path){
            image =<View style={{padding:10}}><Image   style={{
                flex:-1,
                alignSelf: 'center',
                height: 170,
                width: 170,
                marginLeft:10,
                borderWidth: 1,
                borderRadius: 80
                }} resizeMode= "cover" source={{uri: this.state.path}}>

            </Image>
                <Fab
                    active={false}
                    containerStyle={{ marginLeft: 30 }}
                    style={{ backgroundColor: "#ffb3b3" }}
                    position="bottomLeft"
                    onPress={() => this.takePicture()}>
                    <Icon size={10} name="camera" />


                </Fab>
            </View>

        }


        if(!this.props.user.user){
              return <Container></Container>
          }
        return (
            <Container style={{flex:-1,backgroundColor: '#fff'}}>
                <Content  style={{margin:10,backgroundColor: '#fff'}}>

                       {image}

                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(name) => this.setState({name})} placeholder='Name' />
                        </Item>


                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.phone_number} blurOnSubmit={true} returnKeyType='next' ref="1"
                                    onChangeText={(phone_number) => this.setState({phone_number})} placeholder='Phone' />
                        </Item>


                </Content>
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


