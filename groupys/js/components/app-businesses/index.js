import React, {Component} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container, Content, Text, Title, InputGroup,
    Input, Button, Icon, View, Header, Body, Right, ListItem, Tabs, Tab, TabHeading, Thumbnail, Left, Drawer, Fab
} from 'native-base';
import GeneralComponentHeader from '../header/index';
import Business from '../business/index';
import SideBar from '../drawer/index';
import {bindActionCreators} from "redux";
import * as businessAction from "../../actions/business";
import { FormHeader} from '../../ui/index';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

class ApplicationBusinessManager extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)

    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    navigateToAdd() {
        this.replaceRoute('addBusiness');
    }



    render() {

        return (

            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer}>

                <Container>
                    <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                                title={"My Businesses"} bgc="white"
                                submitIcon={<Icon2 active color={"#FA8559"} size={25} name="plus"/>}
                                titleColor="#FA8559" backIconColor="#FA8559"/>

                    <Business navigation={this.props.navigation} ndex={1}
                              />



                </Container>
            </Drawer>
        );
    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(ApplicationBusinessManager);


