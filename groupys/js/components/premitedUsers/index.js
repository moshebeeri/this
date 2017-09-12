import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Fab, InputGroup, Input, Button, View,Header} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';

import * as usersAction from "../../actions/user";
import UserRoleView from './UserRoleView'
import * as businessAction from "../../actions/business";
import { bindActionCreators } from "redux";
import {getBusinessUsers} from '../../selectors/businessesSelector'
import GenericListManager from '../generic-list-manager/index'
 class UserPermittedRoles extends Component {



    constructor(props) {
        super(props);


    }




     componentWillMount(){
         const { navigation} = this.props;
         const business = navigation.state.params.business._id;

         this.props.actions.setBusinessUsers(business);
     }

     renderItem(item){

         return <UserRoleView
                item={item.item}
                index = {item.index}
                />
     }


     navigateToAdd(){
         this.props.navigation.navigate("addPremitedUsers",{business:this.props.navigation.state.params.business});
     }

    render() {
        const { users,navigation,actions,update} = this.props;
        const business = navigation.state.params.business._id;

        return (
            <Container>
                <GenericListManager rows={users[business]} navigation = {navigation} actions={actions}  update={update}
                                    onEndReached={actions.setBusinessUsers} ItemDetail = {this.renderItem.bind(this)}/>

                <Fab

            direction="right"
            active={false}
            containerStyle={{ marginLeft: 10 }}
            style={{ backgroundColor: "#ff6400" }}
            position="bottomRight"
            onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="plus" />

                </Fab>
            </Container>
        );
    }
}


export default connect(
    state => ({
        users: getBusinessUsers(state),
        update:state.businesses.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),

    })
)(UserPermittedRoles);


