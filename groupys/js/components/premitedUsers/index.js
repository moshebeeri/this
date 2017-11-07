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
class UserPermittedRoles extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        const {navigation} = this.props;
        this.props.actions.setBusinessUsers(navigation.state.params.business);
    }

    renderItem(item) {
        return <UserRoleView
            item={item.item}
            index={item.index}
        />
    }

    navigateToAdd() {
        const {navigation} = this.props;

        this.props.navigation.navigate("addPremitedUsers", {business: navigation.state.params.business});
    }

    render() {
        const {users, navigation, actions,update} = this.props;
       let business = navigation.state.params.business
        return (
            <Container>
                <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                            title={"Add User Permission"} bgc="white"
                            submitIcon={<Icon5 active color={"#FA8559"} size={25} name="plus"/>}
                            titleColor="#FA8559" backIconColor="#FA8559"/>

                <GenericListManager rows={users[business._id]} navigation={navigation} actions={actions} update={update}
                                    onEndReached={actions.setBusinessUsers} ItemDetail={this.renderItem.bind(this)}/>


            </Container>
        );
    }
}

export default connect(
    state => ({
        users: getBusinessUsers(state),
        update: state.businesses.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(UserPermittedRoles);


