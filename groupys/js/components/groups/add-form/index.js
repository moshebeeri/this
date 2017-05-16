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
import BusinessApi from "../../../api/business"
let businessApi = new BusinessApi();

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

import {DeviceEventEmitter} from 'react-native'
export default class AddGroup extends Component {

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
            business:',',
            services:[]




        };



    }

    selectBusiness(value){
        this.setState({
            business:value
        })


    }


    async componentWillMount(){
        try {
          let users = await userApi.getUserFollowers();
          this.setState({
              users:users
          })
            let response = await businessApi.getAll();
            if (response) {
                this.initBusiness(response);
            }
        }catch (error){
            console.log(error);
        }

    }


    initBusiness(responseData){

        this.setState({
            services: responseData,
            business: responseData[0]._id
        });
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
            let result = await groupApi.createGroup(group);
            DeviceEventEmitter.emit('AddGroups',  result);
            this.replaceRoute('home');
        }catch (e){
            console.log('failed adding group');
        }

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
        let users = this.state.users;
       this.props.navigation.navigate('SelectUsersComponent',{users:users ,selectUsers: this.selectUsers.bind(this)})

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
            users = <Text> {this.state.selectedUsers.length}  are selected </Text>
        }


        let addPolicyTag = <Picker
            iosHeader="Group Policy"
            mode="dropdown"
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
            selectedValue={this.state.groupType}
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
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.state.services.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name} />
                    }) }
            </Picker>

        }

        return (
            <Container>


                <Content  style={{backgroundColor: '#fff'}}>

                    <View style={{ flexDirection: 'row',marginTop:5 }}>

                        <Button   transparent  onPress={() => this.pickPicture()}>
                            <Text> select image </Text>
                        </Button>

                        {image}
                    </View>



                    <Item underline>
                        <Input value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} autoFocus = {true} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input value = {this.state.info}  blurO
                                nSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>
                    {addPolicyTag}
                    {groupTypeTag}
                    {BusinessPiker}
                    <Button  transparent onPress={() => this.showUsers(true)}>
                        <Text>Select Users </Text>
                        {users}
                    </Button>




                </Content>
                <Footer>

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
