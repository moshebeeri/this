import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Fab, InputGroup, Input, Button, View,Header} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import Icon from 'react-native-vector-icons/EvilIcons';
import GenericListView from '../generic-list-manager/generic-list-view/index'

import * as usersAction from "../../actions/user";

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




    fetchApi(pageOffset,pageSize ) {



    }


     navigateToAdd(){

         this.props.navigation.navigate("addPremitedUsers");
     }

    render() {


        return (
            <Container>
            {/*<GenericListManager navigation = {this.props.navigation} rows={promotions} title="Promotion" component="home" addComponent="addPromotions" api={this}*/}
                                {/*ItemDetail={GenericListView}/>*/}
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
        promotions: state.promotions
    }),

    dispatch => bindActionCreators(usersAction, dispatch)
)(UserPermittedRoles);


