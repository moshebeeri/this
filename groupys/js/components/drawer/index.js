import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {Container, Content, Text, InputGroup, Input, Button, View,Item} from 'native-base';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import theme from '../../themes/base-theme';
import styles from './styles';


const logo = require('../../../images/logo.png');
const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');
import UserApi from '../../api/user'
import login from './drwaer-theme';
let userApi = new UserApi()
export default class ProfileDrawer extends Component {

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

    showPromotions(){
        this.replaceRoute('home');

    }


    render() {
        return (
        <Container>
            <Content theme={login} style={{backgroundColor: '#fff'}}>


                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={noPic}/>
                </Image>

                <Item   onPress={() => this.showPromotions()} style={{ margin:3 } } regular>
                       <Icon2 size={20}  style={{paddingLeft:20}}name='home' />
                        <Text style={{  padding:20,color:'blue',fontStyle: 'normal',fontSize:15 }}>Home</Text>


                </Item>


                <Item  onPress={() => this.showPromotionScaning()}  style={{ margin:3 } } regular>
                    <Icon   size={20} style={{paddingLeft:20}} name="barcode" />

                    <Text style={{ padding:20,color:'blue',fontStyle: 'normal',fontSize:15 }}>Scan Promotion</Text>


                </Item>
                <Item    onPress={() => this.showUserProfile()}  style={{ margin:3 } } regular>
                    <Icon2 size={20}  style={{paddingLeft:20}}name='user' />
                        <Text style={{ padding:20,color:'blue',fontStyle: 'normal',fontSize:15 }}>Profile </Text>


                </Item>


            </Content>
        </Container>

        );
    }
}
