import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Fab,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Text,
    Thumbnail,
    View
} from 'native-base';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import * as userAction from "../../actions/user";
import styles from './styles'
import {FormHeader, Spinner, TextInput,ThisText} from '../../ui/index';
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";

class ChangePassword extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            showMessage: false,
            validationMessage: '',
        }
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.resetPasswordForm();
    }

    focusNextField(nextField) {
        this.refs[nextField]._root.focus()
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

    changePassword() {
        const {actions, navigation} = this.props;
        this.setState({
            showMessage: false
        })
        if (this.validateForm()) {
            if (this.state.confirmPassword !== this.state.newPassword) {
                this.setState({
                    validationMessage: strings.PasswordValidationMessage,
                    showMessage: true
                })
                return;
            }
            actions.changePassword(this.state.currentPassword, this.state.newPassword, navigation);
        }
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    render() {
        const {saving, changeForm} = this.props;
        const message = this.createMessage(changeForm);
        return (<View>
                <FormHeader showBack submitForm={this.changePassword.bind(this)} navigation={this.props.navigation}
                            title={strings.UserChangePassword} bgc="#2db6c8"/>

                <View>

                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                        <TextInput field={strings.CurrentPassword} value={this.state.currentPassword}
                                   returnKeyType='next' ref="1" refNext="1" secureTextEntry
                                   isMandatory
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(currentPassword) => this.setState({currentPassword})}/>
                    </View>
                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                        <TextInput field={strings.NewPassword} value={this.state.newPassword}
                                   returnKeyType='next' ref="2" refNext="2" secureTextEntry
                                   isMandatory
                                   onSubmitEditing={this.focusNextField.bind(this, "3")}
                                   onChangeText={(newPassword) => this.setState({newPassword})}/>
                    </View>
                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                        <TextInput field={strings.ConfirmPassword} value={this.state.confirmPassword}
                                   returnKeyType='done' ref="3" refNext="3" secureTextEntry
                                   onSubmitEditing={this.changePassword.bind(this)}
                                   isMandatory
                                   onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>
                    </View>
                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                        {message}
                    </View>
                    {saving && <Spinner/>}
                </View>

            </View>
        );
    }

    createMessage(changeForm) {
        if (this.state.showMessage) {
            return <ThisText style={{
                fontSize: 16,
                color: 'red',
            }}>{this.state.validationMessage}</ThisText>
        }
        if (changeForm.validationMessage) {
            return <ThisText style={{
                fontSize: 16,
                color: 'red',
            }}>{changeForm.validationMessage}</ThisText>
        }
        return undefined;
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'changePassword') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        changeForm: state.changePasswordForm,
        saving: state.user.saving,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(userAction, dispatch)
    })
)(ChangePassword);


