import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {Container, Content, Text, InputGroup, Input, Button, View,Item} from 'native-base';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';

import styles from './styles';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
const logo = require('../../../images/logo.png');
const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');

const briefcase = require('../../../images/briefcase.png');
const qrcode = require('../../../images/qr-code.png');
const settings =  require('../../../images/settings-work-tool.png');
const changePassword =  require('../../../images/change-password-img.png');
import EntityUtils from "../../utils/createEntity";
import store from 'react-native-simple-store';

let entityUtils = new EntityUtils();
import * as userAction from "../../actions/user";



import login from './drwaer-theme';

class ProfileDrawer extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber:''

        };

        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });
    }

    async componentWillMount(){
        const user = this.props.user
        if(user) {
            this.setState({
                phoneNumber: user.country_code + '-' + user.phone_number
            });
        }


    }


    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }


    showPromotionScaning(){
        this.replaceRoute('ReadQrCode');

    }

    showUserProfile(){
        this.replaceRoute('UserProfile');

    }

    changePassword(){
        this.replaceRoute('changePassword');

    }


    showBusinesses(){
        this.replaceRoute('businesses');

    }


    showPromotions(){
        this.replaceRoute('home');

    }
    async pickPicture() {
        try {
            let image = await ImagePicker.openPicker({

                cropping: true,
                width:2000,
                height:2000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });

            let user = {
                name:this.props.user.name,
                _id: this.props.user._id,
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                phone_number:this.props.user.phone_number,
            }
            entityUtils.update('users',user,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),'');

        }catch (e){
            console.log(e);
        }
    }

    formSuccess(){
        this.props.fetchUsers();
    }
    formFailed(){

    }

    render() {
        let source = noPic;
        if(this.props.user){
            if( this.props.user.pictures && this.props.user.pictures.length > 0){

                source = {
                    uri:this.props.user.pictures[this.props.user.pictures.length -1].pictures[3]
                }

            }
        }
        return (
        <Container>
            <Content theme={login} style={{backgroundColor: '#fff'}}>


                <Image style={styles.image} source={cover}>
                    <TouchableOpacity  style={styles.thumbnail}  onPress={() => this.pickPicture()} >

                    <Image style={styles.thumbnail_image} source={source}/>
                    </TouchableOpacity>
                </Image>

                <TouchableOpacity    onPress={() => this.showBusinesses()}  style={{ margin:3 , flexDirection: 'row', alignItems: 'center',} } regular>
                    <Image style={{marginLeft:10,width:30,height:30}} source={briefcase}/>
                    <Text style={{ padding:20,color:'#67ccf8',fontStyle: 'normal',fontSize:15 }}>Businees </Text>


                </TouchableOpacity>

                <TouchableOpacity  onPress={() => this.showPromotionScaning()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                    <Image style={{marginLeft:10,width:30,height:30}} source={qrcode}/>

                    <Text style={{ padding:20,color:'#67ccf8',fontStyle: 'normal',fontSize:15 }}>Scan Promotion</Text>


                </TouchableOpacity>
                <TouchableOpacity    onPress={() => this.showUserProfile()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                    <Image style={{marginLeft:10,width:30,height:30}} source={settings}/>

                    <Text style={{ padding:20,color:'#67ccf8',fontStyle: 'normal',fontSize:15 }}>Settings </Text>

                </TouchableOpacity>

                <TouchableOpacity    onPress={() => this.changePassword()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                    <Image style={{marginLeft:10,width:30,height:30}} source={changePassword}/>

                    <Text style={{ padding:20,color:'#67ccf8',fontStyle: 'normal',fontSize:15 }}>Change Password </Text>

                </TouchableOpacity>


            </Content>
        </Container>

        );
    }
}


export default connect(
    state => ({
        user: state.authentication.user
    }),
    dispatch => bindActionCreators(userAction, dispatch)

)(ProfileDrawer);
