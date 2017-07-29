import React, {Component} from 'react';
import { Platform,
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



import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text,Icon,Fab} from 'native-base';

import store from 'react-native-simple-store';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();

import styles from './styles'
import * as userAction from "../../../actions/user";
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import Autocomplete from 'react-native-autocomplete-input';

import UserApi from '../../../api/user'
let userApi = new UserApi()
const rolesTypes = [
    {
        value:'',
        label:'Choose Role'
    },

    {
        value:'OWNER',
        label:'owner'
    },
    {
        value:'ADMIN',
        label:'Admin'
    },
    {
        value:'MANAGER',
        label:'Manager'
    },

    {
        value:'SALER',
        label:'Saler'
    },

]
 class AddPermittedUser extends Component {


    constructor(props) {
        super(props);
        this.state={
            userRole:'',

        }


    }

     componentWillMount(){


     }



     replaceRoute() {

        this.props.navigation.goBack();
    }



    focusNextField(nextField) {

       this.refs[nextField]._root.focus()

    }

    selectType(value){
        this.setState({
            type:value
        })


    }



    saveFormData(){



    }


     updateFormData(){

     }

     formSuccess(response){
        this.props.fetchBusiness();

    }

    formFailed(error){
        console.log('failed');
    }


    setUserRoles(role){
        this.setState({
            userRole: role
        })
    }

    async searchUser(){
        let user =  await userApi.getUserByPhone(this.state.phoneNumber)
        console.log('search' + this.state.phoneNumber );

        console.log('found' + user)
     }



    render() {

        let roles = <Picker

            placeholder ="Select User Role"
            mode="dropdown"
            style={styles.picker}
            selectedValue={this.state.userRole}
            onValueChange={this.setUserRoles.bind(this)}>

            {


                rolesTypes.map((s, j) => {
                    return <Item
                        key={j}
                        value={s.value}
                        label={s.label}/>
                }) }

        </Picker>
        let saveButton =  <Button style={{backgroundColor:'#2db6c8'}}
                                  onPress={this.saveFormData.bind(this)}>
            <Text>Add User Role</Text>
        </Button>
        return <View style={styles.premtied_usesrs_container}>
            <Item style={{ margin:3,backgroundColor:'white' } } regular >
                <Input keyboardType = 'numeric' value={this.state.phoneNumber}  blurOnSubmit={true} returnKeyType='done' ref="3"  onSubmitEditing={this.searchUser.bind(this,"4")}  onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='User Phone' />
                <Button  style={{width:65,marginLeft:0,marginRight:10}}large transparent onPress={() =>  this.searchUser()}>
                    <Icon2   size={40}  style={styles.productIcon} name="search" />

                </Button>

            </Item>
            {roles}

            <Item  style={{ margin:15 } } regular>

                {saveButton}
            </Item>
        </View>

    }
}

export default connect(
    state => ({
        users: state.users
    }),
    dispatch => bindActionCreators(userAction, dispatch)
)(AddPermittedUser);
