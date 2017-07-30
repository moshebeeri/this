import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Fab, InputGroup, Input, Button, View,Header} from 'native-base';
import GenericFeedManager from '../generic-feed-manager/index';
import Icon from 'react-native-vector-icons/EvilIcons';
import GenericListView from '../generic-list-manager/generic-list-view/index'

import * as usersAction from "../../actions/user";
import UserRoleView from './UserRoleView'
import UserApi from '../../api/user'
let userApi = new UserApi();
import { bindActionCreators } from "redux";

 class UserPermittedRoles extends Component {



    constructor(props) {
        super(props);
        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            rowsView: [],
            promotions:{}
        }
        ;



    }




     fetchFeeds(){
         this.props.fetchUsersBusiness(this.props.navigation.state.params.business._id);

        }
     fetchTop(id){

     }


     nextLoad(){
        return false;
     }

     navigateToAdd(){
         this.props.navigation.navigate("addPremitedUsers",{business:this.props.navigation.state.params.business});
     }

    render() {
        let rows = this.props.user['business'+this.props.navigation.state.params.business._id];
        if(!rows){
            rows = [];
        }

        return (
            <Container>
            <GenericFeedManager  navigation = {this.props.navigation} loadingDone={true}feeds={rows} nextLoad={false} title="Bussines Users" api={this} ItemDetail={UserRoleView}/>

                <Fab

            direction="right"
            active={false}
            containerStyle={{ marginLeft: 10 }}
            style={{ backgroundColor: "#ffb3b3" }}
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
        user: state.user
    }),

    dispatch => bindActionCreators(usersAction, dispatch)
)(UserPermittedRoles);


