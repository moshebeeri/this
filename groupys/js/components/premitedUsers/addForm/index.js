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



import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text,Icon,Fab,Spinner,Thumbnail} from 'native-base';

import store from 'react-native-simple-store';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
const noPic = require('../../../../images/client_1.png');
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
            user:''

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
       this.save();
        this.props.navigation.goBack();


    }
    async save(){
        if(this.state.user) {
            await userApi.setUserRole(this.state.user,this.state.userRole,this.props.navigation.state.params.business._id);
            this.props.fetchUsersBusiness(this.props.navigation.state.params.business._id);

        }

    }


     updateFormData(){
        if(this.state.user) {
            userApi.setUserRole(this.state.user,this.state.userRole,this.props.navigation.state.params.business._id);
        }
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

     searchUser(){
       this.setState({
           showSpinner:true,
           showMessage:false
       });
       this.search();

     }

     async search(){
         let user =  await userApi.getUserByPhone(this.state.phoneNumber)
         if(user ) {
             this.setState({
                 user:user._id,
                 fullUser:user
             })
         }else{
             this.setState({
                 user:'',
                 fullUser:undefined,
                 showMessage:true,
                 message:"User not found",
             })
         }
         this.setState({
             showSpinner:false,

         })

     }


     createUserView(){

         let pic =   <Thumbnail square size={80} source={noPic} />
         if(this.state.fullUser && this.state.fullUser.pictures && this.state.fullUser.pictures.length > 0){

                 let path = this.state.fullUser.pictures[this.state.fullUser.pictures.length -1].pictures[0];

             pic = <Thumbnail square size={80} source={{uri: path} }/>
         }
         return <View style = {styles.user_view}>
             {pic}
             <Text  style = {{margin:10}}>{this.state.fullUser.name}</Text>

         </View>
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
        let spinner = undefined;
        if(this.state.showSpinner){
            spinner = <View><Spinner color='red' /></View>;
        }
        let userMessage = undefined;
        if(this.state.showMessage){
            userMessage =  <View><Text>{this.state.message}</Text></View>
        }

        let userView = undefined;
        if(this.state.fullUser){
            userView = this.createUserView();
        }
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
            {spinner}
            {userMessage}
            {userView}
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
