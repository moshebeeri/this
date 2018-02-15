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

    renderItem(item) {
        const {navigation} = this.props;
        return <UserRoleView
            item={item.item}
            index={item.index}
            navigation={navigation}
            business = {navigation.state.params.business}
        />
    }

    navigateToAdd() {
        const {navigation} = this.props;

        this.props.navigation.navigate("addPermittedUser", {business: navigation.state.params.business});
    }

    render() {
        const {users, navigation, actions,update} = this.props;
       let business = navigation.state.params.business
        return (
            <Container>
                <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                            title={strings.AddUserPermission} bgc="white"
                            submitIcon={<Icon5 active color={"#FA8559"} size={25} name="plus"/>}
                            titleColor="#FA8559" backIconColor="#FA8559"/>

                <GenericListManager rows={users[business._id]} navigation={navigation} actions={actions} update={update}
                                    onEndReached={actions.setBusinessUsers} ItemDetail={this.renderItem.bind(this)}/>


            </Container>
        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'userPermittedRoles' ||  this.props.currentScreen === 'addPermittedUser') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        users: getBusinessUsers(state),
        update: state.businesses.update,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(UserPermittedRoles);


