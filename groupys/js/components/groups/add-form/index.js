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


import {getMyBusinesses} from './groupAddSelector'


import ImagePicker from 'react-native-image-crop-picker';
import SelectUsersComponent from '../selectUser';


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

const groupPostPolicy = [
    {
        value:'ANYONE',
        label:'Anyone'
    },
    {
        value:'MEMBERS',
        label:'Membersp'
    },
    {
        value:'ADMINS',
        label:'Admins'
    },
    {
        value:'MANAGERS',
        label:'Managers'
    }

]


import * as groupsAction from "../../../actions/groups";
import * as businessesAction from "../../../actions/business";
import * as userAction from "../../../actions/user";
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

    }

    selectBusiness(value){
        this.setState({
            business:value
        })


    }


     componentWillMount(){
        const{businessActions,userActions} = this.props;
         businessActions.setMyBusinesses();
         userActions.fetchUsersFollowers();

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
        const {actions} = this.props;
        const group = this.createGroupFromState();
        this.replaceRoute('home');
        actions.createGroup(group);

     }

     createGroupFromState() {
         const {user} = this.props;

         if (this.state.groupType == 'USERS') {
           return {
                 name: this.state.name,
                 description: this.state.info,
                 entity_type: this.state.groupType,
                 add_policy: this.state.groupPolocy,
                 image: this.state.image,
                 groupUsers: this.state.selectedUsers,
                 post_policy: 'ANYONE',
                 entity: {
                     user: user._id
                 }
             };
         }

        return {
             name: this.state.name,
             description: this.state.info,
             entity_type: this.state.groupType,
             add_policy: this.state.groupPolocy,
             image: this.state.image,
             groupUsers: this.state.selectedUsers,
             entity: {
                 business: this.state.business
             },
             post_policy: 'MANAGERS'

         };


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


    async pickFromCamera() {
        try {
            const image = await ImagePicker.openCamera({
                cropping: true,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                width:2000,
                height:2000,
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
            const image = await ImagePicker.openPicker({
                cropping: true,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                width:2000,
                height:2000,
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }

    showUsers(){
        const {userFollowers} =this.props;
        if(userFollowers.length > 0 ) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: userFollowers,
                selectUsers: this.selectUsers.bind(this)
            })
        }

    }
    render() {
        const{businesses} = this.props;
        const image = this.createImage(this.state.path);
        const users = this.createUserTag(this.state.selectedUsers);
        const addPolicyTag = this.createPolicyTag();
        const groupTypeTag =  this.createGroupTypePiker();
        const BusinessPiker = this.createBusinessPicker(this.state.groupType,businesses);

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

     createGroupTypePiker() {
         const groupTypeTag = <Picker
             iosHeader="Group Type"
             mode="dropdown"
             style={{flex: 1}}
             selectedValue={this.state.groupType}
             itemStyle={ {flexDirection: 'row', marginTop: 10}}
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
         return groupTypeTag;
     }

     createPolicyTag() {
         const addPolicyTag = <Picker
             iosHeader="Group Policy"
             mode="dropdown"
             style={{flex: 1}}
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
         return addPolicyTag;
     }

     createUserTag(selectedUsers) {

         if (selectedUsers) {
            return <Text> {this.state.selectedUsers.length} selected </Text>
         }
         return undefined;
     }

    createBusinessPicker(groupType,businesses) {

        if (groupType == 'BUSINESS' && businesses) {
            const rows =  businesses.map((s, i) => {
                return <Item
                    key={i}
                    value={s._id}
                    label={s.name}/>
            })

            return <Picker
                iosHeader="Select Business"
                mode="dropdown"
                style={{flex: 1}}
                selectedValue={this.state.business}
                itemStyle={ {flexDirection: 'row', marginTop: 4}}
                onValueChange={this.selectBusiness.bind(this)}>
                <Item
                    key={555}
                    value={''}
                    label={"Selecet Business"}/>
                {rows}



            </Picker>

        }
        return undefined;
    }

    createImage(imagePath) {


        if (imagePath) {
            return <Image
                style={{width: 50, height: 50}}
                source={{uri: this.state.path}}
            />

        }
        return undefined;
    }


}
export default connect(
    state => ({

        businesses:getMyBusinesses(state),
        user:state.authentication.user,
        userFollowers:state.user.followers,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
        businessActions: bindActionCreators(businessesAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch),
    })
)(AddGroup);





