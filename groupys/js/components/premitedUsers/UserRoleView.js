/**
 * Created by roilandshut on 30/07/2017.
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './styles'
import {
    Button,
    Container,
    Content,
    Fab,
    Footer,
    Form,
    Icon,
    Input,
    Item,
    Picker,
    Spinner,
    Text,
    Thumbnail
} from 'native-base';
import {EditButton} from '../../ui/index';
const noPic = require('../../../images/client_1.png');
const rolesTypes = {
        OWNS: 'Owner',
        Owner: 'Owner',
        Admin: 'Admin',
        Manager: 'Manager',
        Seller: 'Seller'
    };
import {ThisText} from '../../ui/index';


export default class UserRoleView extends Component {
    createUserView(user, role, index) {
        let pic = <Thumbnail square size={80} source={noPic}/>;
        if (user && user.pictures && user.pictures.length > 0) {
            let path = user.pictures[user.pictures.length - 1].pictures[0];
            pic = <Thumbnail square size={80} source={{uri: path}}/>
        }
        let roleView = <ThisText>{rolesTypes[role]}</ThisText>
        return <View key={index} style={styles.list_user_view}>
            <View style={{justifyContent:'center',flex:1}}>
                {pic}
            </View>
            <View style={{justifyContent:'center',alignItems:'flex-start',flex:3}}>
                <ThisText >{user.name} - <ThisText>{roleView}</ThisText></ThisText>
            </View>
            <View style={{flex:0.5,justifyContent:'center'}}>
                <EditButton onPress={this.editPermission.bind(this, user, rolesTypes[role])}/>
            </View>

        </View>
    }

    editPermission(user,role){
        const{navigation,business} = this.props;
        navigation.navigate("addPermittedUser", {role:role, user:user, business: business});
    }

    render() {
        const {item, index} = this.props;
        return this.createUserView(item.user, item.role, index)
    }
}
