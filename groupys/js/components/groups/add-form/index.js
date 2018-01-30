import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, Text, View,Platform} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles'
import {getMyBusinesses} from '../../../selectors/businessesSelector'
import SelectUsersComponent from '../selectUser';
import {FormHeader, ImagePicker, SelectButton, SimplePicker, Spinner, TextInput} from '../../../ui/index';
import * as groupsAction from "../../../actions/groups";
import * as businessesAction from "../../../actions/business";
import * as userAction from "../../../actions/user";
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"

const {width, height} = Dimensions.get('window')
const groupPolicy = [
    {
        value: 'OPEN',
        label: strings.GroupIsOpen
    },
    {
        value: 'CLOSED',
        label: strings.GroupIsClosed
    }
]
const groupType = [
    {
        value: 'USERS',
        label: strings.UserGroup
    },
    {
        value: 'BUSINESS',
        label: strings.BusinessGroup
    }
]

class AddGroup extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        if (props.navigation.state.params && props.navigation.state.params.group) {
            let group = props.navigation.state.params.group;
            let currentImage = '';
            if(group.pictures.length > 0){
                currentImage = group.pictures[group.pictures.length - 1].pictures[0];
            }
            this.state = {
                name: group.name,
                info: group.description,
                showUsers: false,
                images: '',
                users: [],
                selectedUsers: null,
                groupPolocy: group.add_policy,
                groupType: group.entity_type,
                path: '',
                image: '',
                currentImage:currentImage,
                business: '',
                updateMode: true,
                services: []
            };
        } else {
            this.state = {
                name: null,
                info: null,
                showUsers: false,
                images: '',
                users: [],
                selectedUsers: null,
                groupPolocy: 'OPEN',
                groupType: 'USERS',
                path: '',
                image: '',
                updateMode: false,
                business: '',
                services: []
            };
        }
    }

    selectBusiness(value) {
        this.setState({
            business: value
        })
    }

    componentWillMount() {
        const {businessActions, userActions} = this.props;
        businessActions.setBusinessUsers();
        userActions.fetchUsersFollowers();
    }

    replaceRoute(route) {
        this.props.navigation.goBack();
    }

    selectUsers(users) {
        this.setState({
            selectedUsers: users,
            showUsers: false
        })
    }

    async saveFormData() {
        const {actions} = this.props;
        if (this.validateForm()) {
            const group = this.createGroupFromState();
            actions.createGroup(group, this.props.navigation);
        }
    }

    getGroupPolicy(code) {
        if (code === 'OPEN') {
            return strings.GroupIsOpen;
        }
        if (code === 'CLOSED') {
            return strings.GroupIsClosed;
        }
        return undefined;
    }

    updateGroup() {
        const {actions} = this.props;
        if (this.validateForm()) {
            let group = this.props.navigation.state.params.group;
            group.name = this.state.name;
            group.description = this.state.info;
            group.image = this.state.image;
            actions.updateGroup(group,this.props.navigation)
        }
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

    createGroupFromState() {
        const {user} = this.props;
        if (this.state.groupType === 'USERS') {
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
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    async selectGroupPolocy(value) {
        this.setState({
            groupPolocy: value
        })
    }

    async selectGroupType(value) {
        this.setState({
            groupType: value
        })
    }

    showUsers() {
        const {userFollowers} = this.props;
        if (userFollowers.length > 0) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: userFollowers,
                selectUsers: this.selectUsers.bind(this)
            })
        }
    }

    setCoverImage(image) {
        this.setState({image: image});
    }

    createCoverImageComponnent() {
        const {saving} = this.props;
        let isManadory = true;
        if (this.state.updateMode) {
            isManadory = false;
        }
        if (this.state.image || this.state.currentImage) {
            let coverImage = undefined;
            if(this.state.image) {
                coverImage = <Image
                    style={{width: width - 10, height: 210, borderWidth: 1, borderColor: 'white'}}
                    source={{uri: this.state.image.path}}
                >
                </Image>
            }else{
                coverImage = <Image
                    style={{width: width - 10, height: 210, borderWidth: 1, borderColor: 'white'}}
                    source={{uri: this.state.currentImage}}
                >
                </Image>
            }
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        <ImagePicker ref={"coverImage"} mandatory={isManadory} image={coverImage} color='white'
                                     pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>
                        {saving && <Spinner/>}
                    </View>
                </View>
            </View>
        }
        return <View style={styles.product_upper_container}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} mandatory={isManadory} color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    <Text style={styles.addCoverText}>Add a cover photo</Text>
                </View>
            </View>

        </View>
    }

    render() {
        const {businesses} = this.props;
        let selectedGroupPolicy = this.state.groupPolocy
        if(Platform.OS === 'ios'){
            selectedGroupPolicy = this.getGroupPolicy(this.state.groupPolocy);
        }
        const BusinessPiker = this.createBusinessPicker(this.state.groupType, businesses);
        return (
            <View style={styles.product_container}>
                {this.state.updateMode ?
                    <FormHeader showBack submitForm={this.updateGroup.bind(this)} navigation={this.props.navigation}
                                title={strings.UpdateGroup} bgc="#2db6c8"/>
                    : <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                                  title={strings.AddGroup} bgc="#2db6c8"/>
                }
                <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>


                    {this.createCoverImageComponnent()}
                    <SimplePicker value={selectedGroupPolicy} ref="groupPolicyType"
                                  list={groupPolicy} itemTitle={strings.GroupPolicy}
                                  defaultHeader={strings.ChooseType} isMandatory={!this.state.updateMode}
                                  onValueSelected={this.selectGroupPolocy.bind(this)}/>
                    {!this.state.updateMode &&
                    <SimplePicker ref="groupType" list={groupType} itemTitle={strings.GroupType}
                                  defaultHeader={strings.ChooseType} isMandatory
                                  onValueSelected={this.selectGroupType.bind(this)}/>}

                    {!this.state.updateMode && BusinessPiker}
                    <View style={styles.inputTextLayour}>
                        <TextInput field={strings.GroupName} value={this.state.name}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    </View>

                    <View style={styles.inputTextLayour}>


                        <TextInput field={strings.Description} value={this.state.info} returnKeyType='next' ref="2"
                                   refNext="2"


                                   onChangeText={(info) => this.setState({info})}/>
                    </View>
                    {!this.state.updateMode && <View style={styles.groupSelectUserContainer}>
                        <SelectButton
                            client ref="selectUsers" selectedValue={this.state.selectedUsers} isMandatory
                            title="Members"
                            action={this.showUsers.bind(this, true)}/>
                        {this.state.selectedUsers &&
                        <Text> {strings.SelectedMembers}: {this.state.selectedUsers.length}</Text>}

                    </View>}
                </ScrollView>


            </View>
        );
    }

    createBusinessPicker(groupType, businesses) {
        if (groupType === 'BUSINESS' && businesses) {
            const rows = businesses.map((s, i) => {
                return {
                    value: s._id,
                    label: s.name
                }
            });
            return <SimplePicker ref="BusineesList" list={rows} itemTitle="Businees"
                                 defaultHeader={strings.ChooseBusiness} isMandatory
                                 onValueSelected={this.selectBusiness.bind(this)}/>
        }
        return undefined;
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'AddGroups' || this.props.currentScreen === 'SelectUsersComponent') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        businesses: getMyBusinesses(state),
        user: state.user.user,
        userFollowers: state.user.followers,
        saving: state.groups.saving,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
        businessActions: bindActionCreators(businessesAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch),
    })
)(AddGroup);





