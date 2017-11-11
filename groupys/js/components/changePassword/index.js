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
import {FormHeader, Spinner, TextInput} from '../../ui/index';

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
                    validationMessage: 'New password is different from confirm password',
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
        const { saving, changeForm} = this.props;
        const message = this.createMessage(changeForm);
        return (<View>
                <FormHeader showBack submitForm={this.changePassword.bind(this)} navigation={this.props.navigation}
                            title={"User Change Password"} bgc="#FA8559"/>

                <View>

                    <View style={styles.inputTextLayour}>
                        <TextInput field='Current Password' value={this.state.currentPassword}
                                   returnKeyType='next' ref="1" refNext="1" secureTextEntry
                                   isMandatory
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(currentPassword) => this.setState({currentPassword})}/>
                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput field='New Password' value={this.state.newPassword}
                                   returnKeyType='next' ref="2" refNext="2" secureTextEntry
                                   isMandatory
                                   onSubmitEditing={this.focusNextField.bind(this, "3")}
                                   onChangeText={(newPassword) => this.setState({newPassword})}/>
                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput field='Confirm Password' value={this.state.confirmPassword}
                                   returnKeyType='done' ref="3" refNext="3" secureTextEntry
                                   onSubmitEditing={this.changePassword.bind(this)}
                                   isMandatory
                                   onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>
                    </View>
                    <View style={styles.inputTextLayour}>
                        {message}
                    </View>
                    {saving && <Spinner/>}
                </View>

            </View>
        );
    }

    createMessage(changeForm) {
        if (this.state.showMessage) {
            return <Text style={{
                fontSize: 16,
                color: 'red',
            }}>{this.state.validationMessage}</Text>
        }
        if (changeForm.validationMessage) {
            return <Text style={{
                fontSize: 16,
                color: 'red',
            }}>{changeForm.validationMessage}</Text>
        }
        return undefined;
    }
}

export default connect(
    state => ({
        changeForm: state.changePasswordForm,
        saving: state.user.saving
    }),
    (dispatch) => ({
        actions: bindActionCreators(userAction, dispatch)
    })
)(ChangePassword);


