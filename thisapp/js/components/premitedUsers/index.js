import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Fab, Header, Input, InputGroup, View} from 'native-base';
import UserRoleView from './UserRoleView'
import * as businessAction from "../../actions/business";
import {bindActionCreators} from "redux";
import {getBusinessUsers} from '../../selectors/businessesSelector'
import GenericListManager from '../generic-list-manager/index'
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import {FormHeader} from '../../ui/index';
import strings from "../../i18n/i18n"
import navigationUtils from '../../utils/navigationUtils'

class UserPermittedRoles extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        const {navigation} = this.props;
        this.props.actions.setBusinessUsers(navigation.state.params.business._id);
    }

    navigateToAdd() {
        const {navigation} = this.props;
        let role =  this.getMyUserRole();
        if(role && (role ==='OWNS' || role ==='Admin')) {
            navigationUtils.doNavigation(this.props.navigation, "addPermittedUser", {myRole:role, business: navigation.state.params.business});
        }
    }


    getMyUserRole() {
        const {users, user,navigation} = this.props;
        let business = navigation.state.params.business;
        let rows = users[business._id];
        if(rows) {
            let myUser = rows.filter(row => row.user._id === user._id);
            if (myUser[0]) {
                return myUser[0].role;
            }
        }
        return '';
    }

    showAdd(){
        let role =  this.getMyUserRole();
        if(role && (role ==='OWNS' || role ==='Admin')) {
            return true;
        }

        return false;
    }

    render() {
        const {users, navigation, actions, update,user} = this.props;
        let business = navigation.state.params.business;
        return (
            <Container>
                {this.showAdd() ?
                    <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                                title={strings.AddUserPermission} bgc="white"
                                submitIcon={<Icon5 active color={"#FA8559"} size={25} name="plus"/>}
                                titleColor="#FA8559" backIconColor="#FA8559"/>
                    :
                    <FormHeader showBack navigation={this.props.navigation}
                                title={strings.AddUserPermission} bgc="white"
                                submitIcon={<Icon5 active color={"#FA8559"} size={25} name="plus"/>}
                                titleColor="#FA8559" backIconColor="#FA8559"/>
                }

                <GenericListManager rows={users[business._id]} navigation={navigation} actions={actions} update={update}
                                    business={navigation.state.params.business} onEndReached={actions.setBusinessUsers}
                                    ItemDetail={UserRoleView} user={user}/>


            </Container>
        );
    }

    shouldComponentUpdate() {
        return this.props.currentScreen === 'userPermittedRoles' || this.props.currentScreen === 'addPermittedUser';
    }
}

export default connect(
    state => ({
        users: getBusinessUsers(state),
        user: state.user.user,
        update: state.businesses.update,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(UserPermittedRoles);


