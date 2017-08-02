import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,

    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header,Item,Picker,Footer} from 'native-base';
import store from 'react-native-simple-store';





import ImagePicker from 'react-native-image-crop-picker';
import SelectUsersComponent from '../selectUser';

import UserApi from '../../../api/user'

let userApi = new UserApi();

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();

const groupPolicy = [
    {
        value:'OPEN',
        label:'Group is Open'
    },
    {
        value:'CLOSED',
        label:'Group is closed'
    }
]

const groupType = [
    {
        value:'USERS',
        label:'User Group'
    },
    {
        value:'BUSINESS',
        label:'Business Group'
    }

]


import * as groupsAction from "../../../actions/groups";
import { bindActionCreators } from "redux";

class AddGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            info: null,
            showUsers: false,
            image:'',
            images:'',
            users:[],
            selectedUsers:null,
            groupPolocy:'OPEN',
            groupType:'USERS',
            path:'',
            image: '',
            business:'',
            services:[]




        };

        this.props.fetchBusinesses();
    }

    selectBusiness(value){
        this.setState({
            business:value
        })


    }


    async componentWillMount(){
        try {

           if(this.props.businesses.businesses.length > 0 ) {
                this.setState({
                    business: this.props.businesses.businesses[0]
                })
            }

        }catch (error){
            console.log(error);
        }

    }





    replaceRoute(route) {
        this.props.navigation.goBack();
    }


    selectUsers(users){
        this.setState({
            selectedUsers:users,
            showUsers: false
        })
    }

    async saveFormData(){
        let group = {};
        if(this.state.groupType == 'USERS'){
            let userId = await store.get('user_id');
            group = {
                name : this.state.name,
                description : this.state.info,
                entity_type: this.state.groupType,
                add_policy: this.state.groupPolocy,
                image:this.state.image,
                groupUsers:this.state.selectedUsers,
                entity: {
                    user: userId
                }
            };
        }else{
            if(this.state.groupType == 'BUSINESS'){
                group = {
                    name : this.state.name,
                    description : this.state.info,
                    entity_type: this.state.groupType,
                    add_policy: this.state.groupPolocy,
                    image:this.state.image,
                    groupUsers:this.state.selectedUsers,
                    entity: {
                        business:this.state.business
                    }

                };
            }
        }


        try{
            let result = await groupApi.createGroup(group,this.addToList.bind(this));

            this.replaceRoute('home');
        }catch (e){
            console.log('failed adding group');
        }

     }

     addToList(responseData){
         this.props.fetchGroups();
     }




    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }
    async selectGroupPolocy(value){
        this.setState({
            groupPolocy:value
        })
    }

    async selectGroupType(value){
        this.setState({
            groupType:value
        })
    }

    formFailed(error){
        console.log('failed');
    }
    async pickFromCamera() {
        try {
            let image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                compressImageQuality: 0.5,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }

    async pickPicture() {
        try {
            let image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                compressImageQuality: 0.5,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }

    showUsers(show){
        let users = this.props.user.followers;
        if(users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.selectUsers.bind(this)
            })
        }

    }
    render() {


        let image ;
        if(this.state.path){
            image =  <Image
                            style={{width: 50, height: 50}}
                            source={{uri: this.state.path}}
                        />

        }

        let users;
        if(this.state.selectedUsers){
            users = <Text> {this.state.selectedUsers.length}  selected </Text>
        }


        let addPolicyTag = <Picker
            iosHeader="Group Policy"
            mode="dropdown"
            style={{ flex:1}}
            selectedValue={this.state.groupPolocy}
            onValueChange={this.selectGroupPolocy.bind(this)}
        >

            {


                groupPolicy.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                }) }
        </Picker>

        let groupTypeTag = <Picker
            iosHeader="Group Type"
            mode="dropdown"
            style={{ flex:1}}
            selectedValue={this.state.groupType}
            itemStyle={ {flexDirection: 'row',marginTop:10 }}
            onValueChange={this.selectGroupType.bind(this)}
        >

            {


                groupType.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                }) }
        </Picker>
        let BusinessPiker = undefined;

        if(this.state.groupType == 'BUSINESS' ){
            BusinessPiker = <Picker
                iosHeader="Select Business"
                mode="dropdown"
                style={{ flex:1}}
                selectedValue={this.state.business}
                itemStyle={ {flexDirection: 'row',marginTop:4 }}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.props.businesses.businesses.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.business._id}
                            label={s.business.name} />
                    }) }
            </Picker>

        }

        return (
            <Container style={{margin:10,backgroundColor: '#fff'}}>


                <Content  style={{backgroundColor: '#fff'}}>
                    <Item  style={{ margin:3 } } regular>
                        {addPolicyTag}
                    </Item>
                    <Item  style={{ margin:3 } } regular>
                    {groupTypeTag}
                    </Item>
                    <Item  style={{ margin:3 } } regular>
                    {BusinessPiker}
                    </Item>




                    <Item  style={{ margin:3 } } regular>
                        <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item  style={{ margin:3 } } regular>
                        <Input value = {this.state.info}  blurO
                                nSubmit={true} returnKeyType='done' ref="2"  onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>
                    <Item  style={{ margin:3 } } regular>
                     <Button  transparent onPress={() => this.showUsers(true)}>
                        <Text>Select Users </Text>
                    </Button>
                    {users}
                    </Item>

                    <Item  style={{ margin:3 } } regular>

                        <Button  iconRight transparent  onPress={() => this.pickPicture()}>
                            <Text style={{ fontStyle: 'normal',fontSize:10 }}>Pick </Text>
                            <Icon name='camera' />
                        </Button>




                        <Button   iconRight transparent  onPress={() => this.pickFromCamera()}>
                            <Text style={{ fontStyle: 'normal',fontSize:10 }}>take </Text>
                            <Icon name='camera' />
                        </Button>

                        {image}
                    </Item>

                </Content>
                <Footer style={{backgroundColor: '#fff'}}>


                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Add Group</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }


}



export default connect(
    state => ({
        businesses: state.businesses,
        user: state.user,
    }),
    dispatch => bindActionCreators(groupsAction, dispatch)
)(AddGroup);


