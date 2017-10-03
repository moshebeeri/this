import React, {Component} from 'react';
import {
    Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableHighlight
} from 'react-native';
import {
    Container,
    Content,
    Item,
    Form,
    Picker,
    Input,
    Footer,
    Button,
    Text,
    Icon,
    Fab,
    Spinner,
    Thumbnail
} from 'native-base';
import store from 'react-native-simple-store';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const noPic = require('../../../../images/client_1.png');
import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import styles from './styles'
import * as userRoleAction from "../../../actions/userRole";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

const rolesTypes = [
    {
        value: '',
        label: 'Choose Role'
    },
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
            user: ''
        }
    }

    componentWillMount() {
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
        const {actions, user, role, navigation} = this.props;
        const businessId = navigation.state.params.business._id;
        if (user) {
            actions.saveRole(user, businessId, role)
            navigation.goBack();
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

    render() {
        const {showSpinner, showMessage, role, fullUser, message} = this.props;
        const roles = this.createUserRollPicker(role);
        const spinner = this.createSpinnerTag(showSpinner);
        const userMessage = this.createMessageTag(showMessage, message);
        const userView = this.createUserView(fullUser);
        const saveButton = this.createSaveButtonTag()
        return <View style={styles.premtied_usesrs_container}>
            <Item style={{margin: 3, backgroundColor: 'white'}} regular>
                <Input keyboardType='numeric' value={this.state.phoneNumber} blurOnSubmit={true} returnKeyType='done'
                       ref="3" onSubmitEditing={this.searchUser.bind(this, "4")}
                       onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='User Phone'/>
                <Button style={{width: 65, marginLeft: 0, marginRight: 10}} large transparent
                        onPress={() => this.searchUser()}>
                    <Icon2 size={40} style={styles.productIcon} name="search"/>

                </Button>

            </Item>
            {spinner}
            {userMessage}
            {userView}
            {roles}

            <Item style={{margin: 15}} regular>

                {saveButton}
            </Item>
        </View>
    }

    createSaveButtonTag() {
        return <Button style={{backgroundColor: '#2db6c8'}}
                       onPress={this.saveFormData.bind(this)}>
            <Text>Add User Role</Text>
        </Button>;
    }

    createMessageTag(showMessage, message) {
        if (showMessage) {
            return <View><Text>{message}</Text></View>
        }
        return undefined;
    }

    createUserView(user) {
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
        return <Picker

            placeholder="Select User Role"
            mode="dropdown"
            style={styles.picker}
            selectedValue={role}
            onValueChange={this.setUserRoles.bind(this)}>

            {
                rolesTypes.map((s, j) => {
                    return <Item
                        key={j}
                        value={s.value}
                        label={s.label}/>
                })}

        </Picker>
    }

    createSpinnerTag(showSpinner) {
        if (showSpinner) {
            return <View><Spinner color='red'/></View>;
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
    }),
    (dispatch) => ({
        actions: bindActionCreators(userRoleAction, dispatch),
    })
)(AddPermittedUser);
