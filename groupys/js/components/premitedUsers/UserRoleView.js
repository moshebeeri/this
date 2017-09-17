/**
 * Created by roilandshut on 30/07/2017.
 */
import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableHighlight
} from 'react-native';
import styles from './styles'
import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text,Icon,Fab,Spinner,Thumbnail} from 'native-base';

const noPic = require('../../../images/client_1.png');
const rolesTypes =
    {

       OWNS: 'Owner',

        Owner: 'Owner',

        Admin: 'Admin',
        Manager:'Manager',
        Seller :'Seller'
    }
export default class UserRoleView extends Component {


    createUserView(user,role,index){

        let pic =   <Thumbnail square size={80} source={noPic} />
        if(user && user.pictures && user.pictures.length > 0){

            let path = user.pictures[user.pictures.length -1].pictures[0];

            pic = <Thumbnail square size={80} source={{uri: path} }/>
        }

        let roleView  = <Text style = {{margin:10}}>{rolesTypes[role]}</Text>
        return <View key ={index} style = {styles.list_user_view}>
            {pic}
            <Text  style = {{margin:10}}>{user.name}</Text>
            {roleView}
        </View>
    }

    render(){
        const{item,index} = this.props;
        return this.createUserView(item.user,item.role,index)
    }
}
