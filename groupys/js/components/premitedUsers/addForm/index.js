import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Container, Content, Fab, Footer, Form, Icon, Input, Item, Picker, Text, Thumbnail} from 'native-base';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import EntityUtils from "../../../utils/createEntity";
import styles from './styles'
import * as userRoleAction from "../../../actions/userRole";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {FormHeader, SimplePicker, Spinner, TextInput} from '../../../ui/index';

const noPic = require('../../../../images/client_1.png');
let entityUtils = new EntityUtils();
const rolesTypes = [
    {
        value: 'Owner',
        label: 'Owner'
    },
    {
        value: 'Admin',
        label: 'Admin'
    },
    {
        value: 'Manager',
        label: 'Manager'
    },
    {
        value: 'Seller',
        label: 'Seller'
    },
]

class AddPermittedUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
            user: '',
            searchUser: true,
            defaultRole:'',
        }
    }

    static navigationOptions = ({navigation}) => ({
        header: null
    });

    componentWillMount() {
        const {navigation} = this.props;
        if (navigation.state && navigation.state.params && navigation.state.params.user) {
            this.setState({
                user: navigation.state.params.user,
                searchUser: false,
                defaultRole:navigation.state.params.role,
            });

        }
        this.props.actions.clearForm()
    }

    replaceRoute() {
        this.props.navigation.goBack();
    }

    focusNextField(nextField) {
        this.refs[nextField]._root.focus()
    }

    selectType(value) {
        this.setState({
            type: value
        })
    }

    saveFormData() {
        this.save();
    }

    save() {
        const {actions, user, role, navigation, saving} = this.props;
        if (saving) {
            return;
        }

        const businessId = navigation.state.params.business._id;
        if (this.validateForm()) {
            if(user){
                actions.saveRole(user, businessId, role, navigation)
            }else{
                actions.saveRole(navigation.state.params.user, businessId, role, navigation)
            }

        }
    }

    setUserRoles(role) {
        const {actions} = this.props;
        actions.setRole(role)
    }

    searchUser() {
        const {actions} = this.props;
        actions.search(this.state.phoneNumber);
    }

    validateForm() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    createSearchUser() {
        if (!this.state.searchUser) {
            return <View></View>
        }
        return <View style={styles.inputTextLayour}>

            <TextInput field='User Phone Number' value={this.state.phoneNumber}
                       returnKeyType='next' ref="1" refNext="1"
                       keyboardType='numeric'
                       placeholder="in your contacts"
                       onSubmitEditing={this.searchUser.bind(this)}
                       onChangeText={(phoneNumber) => this.setState({phoneNumber})} isMandatory={true}/>
            <Button style={{position: 'absolute', right: 5, top: 25}} large transparent
                    onPress={() => this.searchUser()}>
                <Icon2 size={40} style={styles.productIcon} name="search"/>

            </Button>

        </View>
    }

    render() {
        const {showSpinner, showMessage, role, fullUser, message, saving} = this.props;
        const roles = this.createUserRollPicker(role);
        const spinner = this.createSpinnerTag(showSpinner);
        const userMessage = this.createMessageTag(showMessage, message);
        const userView = this.createUserView(fullUser);
        const searchUser = this.createSearchUser();
        let title = "Add User Role";
        if (!this.state.searchUser) {
            title = "Update User Role";
        }
        return <View style={styles.premtied_usesrs_container}>
            <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                        title={title} bgc="#FA8559"/>

            {searchUser}
            {spinner}
            {userMessage}
            {userView}
            {roles}
            {saving && <Spinner/>}
        </View>
    }

    createMessageTag(showMessage, message) {
        if (showMessage) {
            return <View><Text>{message}</Text></View>
        }
        return undefined;
    }

    createUserView(user) {
        const {navigation} = this.props;
        if (navigation.state && navigation.state.params && navigation.state.params.user) {
            user = navigation.state.params.user;
        }
        if (user) {
            const pic = this.createUserPic(user);
            return <View style={styles.user_view}>
                {pic}
                <Text style={{margin: 10}}>{user.name}</Text>

            </View>
        }
        return undefined
    }

    createUserPic(user) {
        if (user.pictures && user.pictures.length > 0) {
            const path = user.pictures[user.pictures.length - 1].pictures[0];
            return <Thumbnail square size={80} source={{uri: path}}/>
        }
        return <Thumbnail square size={80} source={noPic}/>;
    }

    createUserRollPicker(role) {

        return <SimplePicker ref="promotionType" list={rolesTypes} itemTitle="Managment Role"
                             defaultHeader="Choose Role" isMandatory
                             defaultValue={this.state.defaultRole}
                             onValueSelected={this.setUserRoles.bind(this)}/>
    }

    createSpinnerTag(showSpinner) {
        if (showSpinner) {
            return <Spinner simple color='red'/>;
        }
        return undefined;
    }
}

export default connect(
    state => ({
        userRole: state.userRole,
        showSpinner: state.userRole.showSpinner,
        showMessage: state.userRole.showMessage,
        fullUser: state.userRole.fullUser,
        user: state.userRole.user,
        message: state.userRole.message,
        role: state.userRole.role,
        saving: state.userRole.saving,
    }),
    (dispatch) => ({
        actions: bindActionCreators(userRoleAction, dispatch),
    })
)(AddPermittedUser);
