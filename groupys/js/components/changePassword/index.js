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

const noPic = require('../../../images/client_1.png');

class ChangePassword extends Component {
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

    changePassword() {
        const {actions, navigation} = this.props;
        this.setState({
            showMessage: false
        })
        if (this.state.confirmPassword !== this.state.newPassword) {
            this.setState({
                validationMessage: 'New password is different from confirm password',
                showMessage: true
            })
            return;
        }
        actions.changePassword(this.state.currentPassword, this.state.newPassword, navigation);
    }

    render() {
        const {actions, navigation, changeForm} = this.props;
        const message = this.createMessage(changeForm);
        return (
            <Container style={{flex: -1, backgroundColor: '#fff'}}>
                <Content style={{margin: 10, backgroundColor: '#fff'}}>


                    <Item style={{margin: 3}} regular>
                        <Input value={this.state.name} blurOnSubmit={true} returnKeyType='next'
                               ref="1"
                               onChangeText={(currentPassword) => this.setState({currentPassword})}
                               secureTextEntry
                               onSubmitEditing={this.focusNextField.bind(this, "newPassword")}
                               placeholder='Current Password'/>
                    </Item>


                    <Item style={{margin: 3}} regular>
                        <Input value={this.state.phone_number} blurOnSubmit={true} returnKeyType='next'
                               ref="newPassword"
                               onChangeText={(newPassword) => this.setState({newPassword})}
                               secureTextEntry
                               onSubmitEditing={this.focusNextField.bind(this, "confirm")}

                               placeholder='New Password'/>
                    </Item>
                    <Item style={{margin: 3}} regular>
                        <Input value={this.state.phone_number} blurOnSubmit={true} returnKeyType='done'
                               ref="confirm"
                               onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                               secureTextEntry
                               onSubmitEditing={this.changePassword.bind(this)}
                               placeholder='Confirm New Password'/>
                    </Item>

                    {message}


                </Content>
                <Footer style={{backgroundColor: '#fff'}}>
                    <Button transparent
                            onPress={this.changePassword.bind(this)}
                    >
                        <Text>Change Password</Text>
                    </Button>

                </Footer>

            </Container>
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
    }),
    (dispatch) => ({
        actions: bindActionCreators(userAction, dispatch)
    })
)(ChangePassword);


