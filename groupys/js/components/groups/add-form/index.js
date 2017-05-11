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

import AddFormHeader from '../../header/addFormHeader';




import ImagePicker from 'react-native-image-crop-picker';
import SelectUsersComponent from '../selectUser';

import UserApi from '../../../api/user'

let userApi = new UserApi();

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();

const {
    replaceAt,
} = actions;

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
class AddGroup extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


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




        };



    }




    async componentWillMount(){
        try {
          let users = await userApi.getUserFollowers();
          this.setState({
              users:users
          })
        }catch (error){
            console.log(error);
        }

    }

    replaceRoute(route) {
        this.props.replaceAt('add-group', {key: route}, this.props.navigation.key);
    }


    selectUsers(users){
        this.setState({
            selectedUsers:users,
            showUsers: false
        })
    }

    async saveFormData(){
        let group = {
            name : this.state.name,
            description : this.state.info,
            entity_type: this.state.groupType,
            add_policy: this.state.groupPolocy,
            image:this.state.image,
            entity:this.state.selectedUsers

        };

        try{
            let result = await groupApi.createGroup(group);
            console.log(result)
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
        this.setState({
            showUsers: show
        })

    }
    render() {

        if(this.state.showUsers){
            return <SelectUsersComponent selectUsers = {this.selectUsers.bind(this)}users={this.state.users}> </SelectUsersComponent>
        }

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


        return (
            <Container>
                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <AddFormHeader currentLocation="add-group" backLocation="home" />
                </Header>

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


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(AddGroup);
