import React, {Component} from 'react';
import {Image, ScrollView, Text, View,Dimensions} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles'
import {getMyBusinesses} from '../../../selectors/businessesSelector'
import SelectUsersComponent from '../selectUser';
import {FormHeader, ImagePicker, SelectButton, SimplePicker, Spinner, TextInput} from '../../../ui/index';
import * as groupsAction from "../../../actions/groups";
import * as businessesAction from "../../../actions/business";
import * as userAction from "../../../actions/user";
import {bindActionCreators} from "redux";
const {width, height} = Dimensions.get('window')

const groupPolicy = [
    {
        value: 'OPEN',
        label: 'Group is Open'
    },
    {
        value: 'CLOSED',
        label: 'Group is closed'
    }
]
const groupType = [
    {
        value: 'USERS',
        label: 'User Group'
    },
    {
        value: 'BUSINESS',
        label: 'Business Group'
    }
]
const groupPostPolicy = [
    {
        value: 'ANYONE',
        label: 'Anyone'
    },
    {
        value: 'MEMBERS',
        label: 'Membersp'
    },
    {
        value: 'ADMINS',
        label: 'Admins'
    },
    {
        value: 'MANAGERS',
        label: 'Managers'
    }
]

class AddGroup extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
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
            business: '',
            services: []
        };
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
        if (this.state.image) {
            let coverImage = <Image
                style={{width: width - 10, height: 210, borderWidth: 1, borderColor: 'white'}}
                source={{uri: this.state.image.path}}
            >
                {saving && <Spinner/>}
            </Image>
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>
                    </View>
                </View>
            </View>
        }
        return <View style={styles.product_upper_container}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} mandatory color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    <Text style={styles.addCoverText}>Add a cover photo</Text>
                </View>
            </View>

        </View>
    }

    render() {
        const {businesses} = this.props;
        const BusinessPiker = this.createBusinessPicker(this.state.groupType, businesses);
        return (
            <View style={styles.product_container}>
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={"Add Group"} bgc="#2db6c8"/>
                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>


                    {this.createCoverImageComponnent()}
                    <SimplePicker ref="groupPolicyType" list={groupPolicy} itemTitle="Group Policy"
                                  defaultHeader="Choose Type" isMandatory
                                  onValueSelected={this.selectGroupPolocy.bind(this)}/>
                    <SimplePicker ref="groupType" list={groupType} itemTitle="Group Type"
                                  defaultHeader="Choose Type" isMandatory
                                  onValueSelected={this.selectGroupType.bind(this)}/>

                    {BusinessPiker}
                    <View style={styles.inputTextLayour}>
                        <TextInput field='Group Name' value={this.state.name}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    </View>

                    <View style={styles.inputTextLayour}>


                        <TextInput field='Description' value={this.state.info} returnKeyType='next' ref="2" refNext="2"


                                   onChangeText={(info) => this.setState({info})}/>
                    </View>
                    <View style={styles.groupSelectUserContainer}>
                        <SelectButton
                            client ref="selectUsers" selectedValue={this.state.selectedUsers} isMandatory
                            title="Members"
                            action={this.showUsers.bind(this, true)}/>
                        {this.state.selectedUsers && <Text> Selected Members: {this.state.selectedUsers.length}</Text>}

                    </View>
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
                                 defaultHeader="Choose Businees" isMandatory
                                 onValueSelected={this.selectBusiness.bind(this)}/>
        }
        return undefined;
    }
}

export default connect(
    state => ({
        businesses: getMyBusinesses(state),
        user: state.authentication.user,
        userFollowers: state.user.followers,
        saving: state.groups.saving
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
        businessActions: bindActionCreators(businessesAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch),
    })
)(AddGroup);





