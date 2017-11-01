import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, Fab, InputGroup, Input, Button, View, Header} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import * as usersAction from "../../actions/user";
import UserRoleView from './UserRoleView'
import * as businessAction from "../../actions/business";
import {bindActionCreators} from "redux";
import {getBusinessUsers} from '../../selectors/businessesSelector'
import GenericListManager from '../generic-list-manager/index'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles'
class UserPermittedRoles extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {navigation,business} = this.props;
        this.props.actions.setBusinessUsers(business);
    }

    renderItem(item) {
        return <UserRoleView
            item={item.item}
            index={item.index}
        />
    }

    navigateToAdd() {
        const {business} = this.props;

        this.props.navigation.navigate("addPremitedUsers", {business: business});
    }

    render() {
        const {users, navigation, actions,update,business} = this.props;

        return (
            <Container>
                <View style={styles.addProductContainer}>
                    <TouchableOpacity style={styles.addProductButton}
                                      onPress={this.navigateToAdd.bind(this)}>
                        <Icon2 active color={"#FA8559"} size={18} name="plus"/>
                        <Text style={styles.addProductTextStyle}>Add Permission</Text>
                    </TouchableOpacity>
                </View>
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


