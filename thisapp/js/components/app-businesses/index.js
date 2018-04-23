import React, {Component} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Drawer,
    Fab,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Tab,
    TabHeading,
    Tabs,
    Thumbnail,
    Title,
    View
} from 'native-base';
import Business from '../business/index';
import SideBar from '../drawer/index';
import {bindActionCreators} from "redux";
import * as businessAction from "../../actions/business";
import {FormHeader} from '../../ui/index';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import navigationUtils from '../../utils/navigationUtils'

class ApplicationBusinessManager extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)

    }

    replaceRoute(route) {
        navigationUtils.doNavigation( this.props.navigation,route);
    }

    navigateToAdd() {
        this.replaceRoute('addBusiness');
    }

    shouldComponentUpdate(){
        if(this.props.currentScreen ==='businesses' ){
            return true;
        }
        return false;
    }

    render() {
        let icon = <Icon2 active color={"#FA8559"} size={StyleUtils.scale(25)} name="plus"/>
        if (Platform.OS === 'ios') {
            icon = <Icon active color={"#FA8559"} size={StyleUtils.scale(25)} name="ios-add"/>;
        }

        return (

            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer}>

                <Container>
                    <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                                title={strings.MyBusinesses} bgc="white"
                                submitIcon={icon}
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
        businesses: state.businesses,
        currentScreen:state.render.currentScreen,
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(ApplicationBusinessManager);


