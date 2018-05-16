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
    Thumbnail
} from 'native-base';
import {EditButton, ImageController, ThisText} from '../../ui/index';
import StyleUtils from '../../utils/styleUtils'
import navigationUtils from '../../utils/navigationUtils'

const noPic = require('../../../images/client_1.png');
const rolesTypes = {
    OWNS: 'Owner',
    Owner: 'Owner',
    Admin: 'Admin',
    Manager: 'Manager',
    Seller: 'Seller'
};
export default class UserRoleView extends Component {
    createUserView(user, role, index, myUser) {
        let pic = <ImageController thumbnail square size={60} source={noPic}/>;
        if (user && user.pictures && user.pictures.length > 0) {
            let path = user.pictures[user.pictures.length - 1].pictures[0];
            pic = <ImageController thumbnail square size={StyleUtils.scale(60)} source={{uri: path}}/>
        }
        let roleView = <ThisText>{rolesTypes[role]}</ThisText>
        return <View key={index} style={styles.list_user_view}>
            <View style={{justifyContent: 'center', flex: 1}}>
                {pic}
            </View>
            <View style={{justifyContent: 'center', alignItems: 'flex-start', flex: 3}}>
                <ThisText style={{fontSize: StyleUtils.scale(14)}}>{user.name} - <ThisText
                    style={{fontSize: StyleUtils.scale(14)}}>{roleView}</ThisText></ThisText>
            </View>
            {this.showEdit() && <View style={{flex: 0.5, justifyContent: 'center'}}>
                <EditButton color={'#FA8559'} onPress={this.editPermission.bind(this, user, rolesTypes[role])}/>
            </View>}

            {this.showRemove() && <View style={{flex: 0.5, justifyContent: 'center'}}>
                <EditButton iconName={'delete'} color={'#FA8559'} onPress={this.removeUser.bind(this, user)}/>
            </View>}

        </View>
    }

    showEdit() {
        const {item, user} = this.props;
        if (item.role === 'OWNS' && user._id !== item.user._id) {
            return false;
        }
        let myRole = this.getMyUserRole();
        if (myRole === 'Admin' || myRole ==='OWNS' ) {
            return true;
        }

        return false
    }

    showRemove() {
        const {item, user} = this.props;
        if (item.role === 'OWNS' && user._id !== item.user._id) {
            return false;
        }

        if( user._id === item.user._id){
            return false;
        }

        let myRole = this.getMyUserRole();
        if (myRole === 'Admin' || myRole ==='OWNS' ) {
            return true;
        }

        return false;



    }

    getMyUserRole() {
        const {rows, user} = this.props;
        if(rows) {
            let myUser = rows.filter(row => row.user._id === user._id);
            if (myUser[0]) {
                return myUser[0].role;
            }
        }
        return '';
    }

    editPermission(user, role) {
        const {navigation, business} = this.props;
        navigationUtils.doNavigation(navigation, "addPermittedUser", {myRole: this.getMyUserRole(),role: role, user: user, business: business});
    }

    removeUser(user) {
        const {business, actions} = this.props;
        actions.removeUser(user, business._id);
    }

    render() {
        const {item, index, user} = this.props;
        return this.createUserView(item.user, item.role, index, user)
    }
}
