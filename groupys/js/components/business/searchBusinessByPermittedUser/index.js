import React, {Component} from 'react';
import {I18nManager, View,Keyboard} from 'react-native';
import {Button, Container, Content, Fab, Footer, Form, Icon, Input, Item, Picker, Text, Thumbnail} from 'native-base';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {FormHeader, SimplePicker, Spinner, TextInput} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";

const noPic = require('../../../../images/client_1.png');

class SearchBusinessByPermittedUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            searchUser: true,
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
            });
        }
        this.props.actions.clearUserBusinessByPhoneForm()
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
        const {actions, user, navigation, saving} = this.props;
        if (saving) {
            return;
        }
        const businessId = navigation.state.params.business._id;
        if (this.validateForm()) {
            if (user) {
                //actions.saveRole(user, businessId, role, navigation)
            } else {
                //actions.saveRole(navigation.state.params.user, businessId, role, navigation)
            }
        }
    }


    searchUser() {
        const {actions} = this.props;
        Keyboard.dismiss();
        actions.searchUserBusinessesByPhoneNumber(this.state.phoneNumber);
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

    createSearchUserBusinessByPhone() {
        if (!this.state.searchUser) {
            return <View></View>
        }
        return  <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

            <TextInput field={strings.UserPhoneNumber} value={this.state.phoneNumber}
                       returnKeyType='done' ref="1" refNext="1"
                       keyboardType='numeric'
                       placeholder={strings.InYourContacts}
                       onSubmitEditing={this.searchUser.bind(this)}
                       onChangeText={(phoneNumber) => this.setState({phoneNumber})} isMandatory={true}/>


            <Button style={{position: 'absolute', right: 5, top: 25}} large transparent
                    onPress={() => this.searchUser()}>
                <Icon2 size={40} style={styles.productIcon} name="search"/>

            </Button>


        </View>
    }

    render() {
        const {showSpinner, showMessage, fullUser, message, saving} = this.props;
        const spinner = this.createSpinnerTag(showSpinner);
        const userMessage = this.createMessageTag(showMessage, message);
        const userView = this.createUserView(fullUser);
        const searchUser = this.createSearchUserBusinessByPhone();
        let title = strings.SearchBusinessByUserPhoneNumberTitle;
        if (!this.state.searchUser) {
            title = strings.UpdateUserRole;
        }
        return <View style={[styles.permitted_users_container, {width: StyleUtils.getWidth()}]}>

            <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                        title={title} bgc="#FA8559"/>

            {searchUser}
            {spinner}
            {userMessage}
            {userView}
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
            return  <View style={[styles.user_view, {width: StyleUtils.getWidth() - 15}]}>
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

    createSpinnerTag(showSpinner) {
        if (showSpinner) {
            return <Spinner simple color='red'/>;
        }
        return undefined;
    }

    shouldComponentUpdate() {
        return this.props.currentScreen === 'addPermittedUser';
    }
}

export default connect(
    state => ({
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(SearchBusinessByPermittedUser);
