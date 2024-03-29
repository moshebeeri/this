import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles'
import {getMyBusinesses} from '../../../selectors/businessesSelector'
import GenericListManager from '../../generic-list-manager'
import SelectUsersComponent from '../selectUser';
import {
    FormHeader,
    ImageController,
    ImagePicker,
    SelectButton,
    SimplePicker,
    Spinner,
    TextInput,
    ThisText
} from '../../../ui/index';
import * as groupsAction from "../../../actions/groups";
import * as businessesAction from "../../../actions/business";
import * as userAction from "../../../actions/user";
import StyleUtils from '../../../utils/styleUtils'
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"
import navigationUtils from '../../../utils/navigationUtils'
import FontAwesome from "react-native-vector-icons/FontAwesome";

const noPic = require('../../../../images/client_1.png');
const {width, height} = Dimensions.get('window');
const groupPolicy = [
    {
        value: 'OPEN',
        label: strings.GroupIsOpen
    },
    {
        value: 'CLOSE',
        label: strings.GroupIsClosed
    }
];
const groupType = [
    {
        value: 'USER',
        label: strings.UserGroup
    },
    {
        value: 'BUSINESS',
        label: strings.BusinessGroup
    }
];

class AddGroup extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        if (props.navigation.state.params && props.navigation.state.params.group) {
            let group = props.navigation.state.params.group;
            let currentImage = '';
            if (group.pictures.length > 0) {
                currentImage = group.pictures[group.pictures.length - 1].pictures[0];
            } else {
                if (group.entity && group.entity.business) {
                    if (group.entity.business.logo) {
                        currentImage = group.entity.business.logo;
                    }
                }
            }
            this.state = {
                name: group.name,
                info: group.description,
                groupChat: (group.chat_policy === 'ON') ? true : false,
                showUsers: false,
                images: '',
                users: [],
                qrcodeSource: group.qrcodeSource,
                selectedUsers: null,
                groupPolocy: group.add_policy,
                groupType: group.entity_type,
                path: '',
                image: '',
                currentImage: currentImage,
                business: '',
                updateMode: true,
                codeStyle: {
                    width: StyleUtils.scale(80),
                    height: StyleUtils.scale(80),
                    marginBottom: -10,
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeTextStyle: {fontSize: 14, marginTop: 5},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    width: StyleUtils.scale(110), height: StyleUtils.scale(110),
                    position: 'absolute',
                    top: 30,
                    right: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderWidth: 2,
                    borderRadius: 10,
                    elevation: 10,
                    borderColor: 'gray',
                },
                codeFullSize: false,
                showQrcCode: true,
                group: group,
                viewOnly: props.navigation.state.params.view,
                services: []
            };
        } else {
            this.state = {
                name: null,
                showQrcCode: false,
                codeFullSize: false,
                info: null,
                showUsers: false,
                images: '',
                users: [],
                selectedUsers: null,
                groupPolocy: '',
                groupType: 'USERS',
                path: '',
                groupChat: true,
                image: '',
                updateMode: false,
                business: '',
                viewOnly: false,
                services: [],
            };
        }
    }

    selectBusiness(value) {
        this.setState({
            business: value
        })
    }

    groupChatToggle(value) {
        this.setState({groupChat: !this.state.groupChat});
    }

    componentWillMount() {
        const {businessActions, userActions, actions, groupsFollowers} = this.props;
        if (this.state.showQrcCode && this.props.navigation.state.params.group) {
            const group = this.props.navigation.state.params.group;
            actions.setGroupQrCode(group)
            if (!groupsFollowers[group._id] || (groupsFollowers[group._id] && groupsFollowers[group._id].length === 0 )) {
                actions.getNextGroupsFollowers(group._id);
            }
        }
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
        Keyboard.dismiss();
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
            group.chat_policy = this.state.groupChat ? 'ON' : 'OFF';
            actions.updateGroup(group, this.props.navigation)
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
        if (this.state.groupType === 'USER') {
            return {
                name: this.state.name,
                description: this.state.info,
                entity_type: this.state.groupType,
                chat_policy: this.state.groupChat ? 'ON' : 'OFF',
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
            chat_policy: this.state.groupChat ? 'ON' : 'OFF',
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
            navigationUtils.doNavigation(this.props.navigation, 'SelectUsersComponent', {
                users: userFollowers,
                selectUsers: this.selectUsers.bind(this)
            });
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
            if (this.state.image) {
                coverImage = <ImageController
                    style={{width: StyleUtils.getWidth(), height: StyleUtils.relativeHeight(30, 30)}}
                    source={{uri: this.state.image.path}}
                >
                </ImageController>
            } else {
                coverImage = <ImageController
                    style={{width: StyleUtils.getWidth(), height: StyleUtils.relativeHeight(30, 30),}}
                    source={{uri: this.state.currentImage}}
                >
                </ImageController>
            }
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        {this.state.viewOnly ? coverImage :
                            <ImagePicker ref={"coverImage"} mandatory={isManadory} image={coverImage} color='white'
                                         pickFromCamera
                                         setImage={this.setCoverImage.bind(this)}/>}
                        {saving && <Spinner/>}


                    </View>
                </View>
            </View>
        }
        return <TouchableOpacity onPress={this.openMenu.bind(this)} style={styles.product_upper_container}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} mandatory={isManadory} color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    <ThisText style={styles.addCoverText}>{strings.AddACoverPhoto}</ThisText>
                </View>
            </View>

        </TouchableOpacity>
    }

    openMenu() {
        this.refs["coverImage"].openMenu();
    }

    changeQrLook() {
        if (this.state.codeFullSize) {
            this.setState({
                codeStyle: {
                    width: StyleUtils.scale(80),
                    height: StyleUtils.scale(80),
                    marginBottom: -10,
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeTextStyle: {fontSize: 14, marginTop: 5},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    width: StyleUtils.scale(110), height: StyleUtils.scale(110),
                    position: 'absolute',
                    top: 30,
                    right: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderWidth: 2,
                    borderRadius: 10,
                    elevation: 10,
                    borderColor: 'gray',
                },
                codeFullSize: false,
            })
        } else {
            this.setState({
                codeStyle: {
                    width: StyleUtils.scale(150),
                    height: StyleUtils.scale(150),
                    alignItems: 'center',
                    marginBottom: -10,
                    justifyContent: 'center'
                },
                codeTextStyle: {fontSize: 14, marginTop: 5,},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: (StyleUtils.relativeHeight(30, 30) - StyleUtils.scale(170)) / 2,
                    right: (StyleUtils.getWidth() - StyleUtils.scale(170)) / 2,
                    width: StyleUtils.scale(170), height: StyleUtils.scale(170),
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderWidth: 2,
                    borderRadius: 10,
                    elevation: 10,
                    borderColor: 'gray',
                },
                codeFullSize: true,
            })
        }
    }

    nextGroupFollowers() {
        const {actions} = this.props;
        if (this.state.group) {
            actions.getNextGroupsFollowers(this.state.group._id);
        }
    }

    renderFollowerItem(item) {
        let source = noPic;
        if (item.item.pictures && item.item.pictures.length > 0) {
            source = {
                uri: item.item.pictures[item.item.pictures.length - 1].pictures[3]
            }
        }
        return <View style={{
            flex: 1,
            width: StyleUtils.getWidth() - 10,
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            height: StyleUtils.scale(70)
        }}>
            <ImageController thumbnail size={StyleUtils.scale(50)} source={source}/>
            <ThisText style={{marginLeft: 10, marginRight: 10}}>{item.item.name}</ThisText>

        </View>
    }

    render() {
        const {businesses, lastGroupQrCode, groupsFollowers} = this.props;
        let selectedGroupPolicy = this.state.groupPolocy
        if (Platform.OS === 'ios') {
            selectedGroupPolicy = this.getGroupPolicy(this.state.groupPolocy);
        }
        const BusinessPiker = this.createBusinessPicker(this.state.groupType, businesses);
        let qrCodeString = this.state.codeFullSize ? strings.ScanToFollow : strings.clickToEnlarge;
        let qrcodeView = undefined;
        if (this.state.showQrcCode) {
            if (this.state.qrcodeSource) {
                qrcodeView = <TouchableOpacity onPress={() => this.changeQrLook()}
                                               style={this.state.codeContainerStyle}>

                    <Image
                        style={this.state.codeStyle} resizeMode="cover"
                        source={{uri: this.state.qrcodeSource}}>

                    </Image>
                    <ThisText style={this.state.codeTextStyle}>{qrCodeString}</ThisText>
                </TouchableOpacity>
            } else {
                qrcodeView = <TouchableOpacity onPress={() => this.changeQrLook()}
                                               style={this.state.codeContainerStyle}>

                    <Image
                        style={this.state.codeStyle} resizeMode="cover"
                        source={{uri: lastGroupQrCode}}>

                    </Image>
                    <ThisText style={this.state.codeTextStyle}>{qrCodeString}</ThisText>
                </TouchableOpacity>
            }
        }
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={'position'} style={styles.product_container}>
                    {this.createView(qrcodeView, selectedGroupPolicy, BusinessPiker)}

                </KeyboardAvoidingView>
            );
        }
        return (
            <View style={styles.product_container}>
                {this.createView(qrcodeView, selectedGroupPolicy, BusinessPiker)}

            </View>
        );
    }

    showQrcode() {
        let group = this.props.navigation.state.params.group;
        Linking.openURL(`${server_host}/api/qrcodes/` + group._id);
    }

    createView(qrcodeView, selectedGroupPolicy, BusinessPiker) {
        const {groupsFollowers} = this.props;
        let backgroundColor = `${appBackgroundColor}`;
        if (this.state.viewOnly) {
            backgroundColor = 'white';
        }
        return <View style={{backgroundColor: backgroundColor}}>
            {this.state.updateMode && !this.state.viewOnly &&
            <FormHeader showBack submitForm={this.updateGroup.bind(this)} navigation={this.props.navigation}
                        title={strings.UpdateGroup} bgc="#2db6c8"/>}
            {!this.state.updateMode && !this.state.viewOnly &&
            <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                        title={strings.AddGroup} bgc="#2db6c8"/>
            }
            {this.state.viewOnly && <FormHeader showBack navigation={this.props.navigation}
                                                title={strings.ViewGroup} bgc="#2db6c8"/>}
            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor,
            }} style={styles.contentContainer}>


                {this.createCoverImageComponnent()}
                {qrcodeView}
                {!this.state.viewOnly && <View style={{
                    marginTop: 4, padding: 3, marginBottom: 5,
                    width: width - 15, justifyContent: 'space-between', flexDirection: 'row'
                }}>
                    <ThisText style={styles.textInputTextStyle}>{strings.GroupChat}</ThisText>
                    <Switch

                        onTintColor={'#2db6c8'}

                        onValueChange={this.groupChatToggle.bind(this)}
                        value={this.state.groupChat}/>
                </View>}
                {!this.state.viewOnly && <SimplePicker value={selectedGroupPolicy} ref="groupPolicyType"
                                                       disable={this.state.viewOnly}
                                                       list={groupPolicy} itemTitle={strings.GroupPolicy}
                                                       defaultHeader={strings.ChooseType}
                                                       isMandatory={!this.state.updateMode}
                                                       onValueSelected={this.selectGroupPolocy.bind(this)}/>}
                {!this.state.updateMode &&
                <SimplePicker ref="groupType" list={groupType} itemTitle={strings.GroupType}
                              disable={this.state.viewOnly}
                              defaultHeader={strings.ChooseType} isMandatory
                              onValueSelected={this.selectGroupType.bind(this)}/>}

                {!this.state.updateMode && BusinessPiker}


                <View style={styles.inputTextLayour}>
                    {this.state.viewOnly ? <View>
                            <ThisText style={{
                                marginTop: 20,
                                marginLeft: 10,
                                fontSize: 14,
                                color: '#A9A9A9'
                            }}>{strings.GroupName}</ThisText>
                            <ThisText style={{marginTop: 5, marginLeft: 10, fontSize: 20}}>{this.state.name}</ThisText>
                        </View> :
                        <TextInput disabled={this.state.viewOnly} field={strings.GroupName} value={this.state.name}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    }

                </View>

                {this.state.info && <View style={styles.inputTextLayour}>

                    {this.state.viewOnly ? <View>
                            <ThisText
                                style={{marginLeft: 10, fontSize: 14, color: '#A9A9A9'}}>{strings.Description}</ThisText>
                            <ThisText style={{marginTop: 5, marginLeft: 10, fontSize: 20}}>{this.state.info}</ThisText>
                        </View> :
                        <TextInput disabled={this.state.viewOnly} field={strings.Description} value={this.state.info}
                                   returnKeyType='next' ref="2"
                                   refNext="2"


                                   onChangeText={(info) => this.setState({info})}/>}
                </View>}
                {this.state.viewOnly &&
                <View style={styles.inputTextLayour}>

                    <View>
                        <ThisText
                            style={{marginLeft: 10, fontSize: 14, color: '#A9A9A9'}}>{strings.GroupPolicy}</ThisText>
                        <ThisText style={{marginTop: 5, marginLeft: 10, fontSize: 20}}>{selectedGroupPolicy}</ThisText>
                    </View>
                </View>}

                {this.state.viewOnly &&
                <TouchableOpacity onPress={() => this.showQrcode()}
                                  style={[styles.inputFullTextLayout, {marginTop:StyleUtils.scale(5),width: StyleUtils.getWidth() - 15}]}>
                    <ThisText note
                              style={{
                                  fontSize: StyleUtils.scale(14),
                                  color: '#A9A9A9',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: StyleUtils.scale(20),
                                  marginLeft: 15
                              }}>{strings.downloadGroupQrCode}</ThisText>

                </TouchableOpacity>
                }

                {!this.state.updateMode && <View style={styles.groupSelectUserContainer}>
                    <SelectButton
                        client ref="selectUsers" selectedValue={this.state.selectedUsers} isMandatory
                        title="Members"
                        action={this.showUsers.bind(this, true)}/>
                    {this.state.selectedUsers &&
                    <ThisText
                        style={{fontSize: StyleUtils.scale(14)}}> {strings.SelectedMembers}: {this.state.selectedUsers.length}</ThisText>}

                </View>}
                <View style={{height: StyleUtils.scale(30), width: StyleUtils.getWidth()}}></View>

                {(this.state.viewOnly || this.state.updateMode) && groupsFollowers[this.state.group._id] &&
                <View style={styles.inputTextLayour}>
                    <ThisText
                        style={{marginLeft: 10, fontSize: 14, color: '#A9A9A9'}}>{strings.Members}</ThisText>
                </View>}
                {(this.state.viewOnly || this.state.updateMode) && groupsFollowers[this.state.group._id] && groupsFollowers[this.state.group._id].length > 0 &&
                <GenericListManager rows={groupsFollowers[this.state.group._id]}
                                    onEndReached={this.nextGroupFollowers.bind(this)}
                                    ItemDetail={this.renderFollowerItem.bind(this)}/>
                }
            </ScrollView>

        </View>;
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
        lastGroupQrCode: state.groups.lastGroupQrcode,
        groupsFollowers: state.groups.allGroupFollowers
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
        businessActions: bindActionCreators(businessesAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch),
    })
)(AddGroup);





