import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {Container, Content, Text, InputGroup, Input, Button, View,Item} from 'native-base';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

import UserApi from '../../api/user'
import login from './drwaer-theme';
let userApi = new UserApi()
class ProfileDrawer extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber:''

        };
    }

    async componentWillMount(){
        let user = await userApi.getUser();
        this.setState({
            phoneNumber:user.country_code + '-' + user.phone_number
        });


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


    showBusinesses(){
        this.replaceRoute('businesses');

    }


    showPromotions(){
        this.replaceRoute('home');

    }


    render() {
        let source = noPic;
        if(this.props.user.user){
            if( this.props.user.user.pictures && this.props.user.user.pictures.length > 0){

                source = {
                    uri:this.props.user.user.pictures[this.props.user.user.pictures.length -1].pictures[3]
                }

            }
        }
        return (
        <Container>
            <Content theme={login} style={{backgroundColor: '#fff'}}>


                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={source}/>
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



            </Content>
        </Container>

        );
    }
}


export default connect(
    state => ({
        user: state.user
    }),

)(ProfileDrawer);
