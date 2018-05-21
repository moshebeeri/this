import React, {Component} from "react";
import {BackHandler, I18nManager, InteractionManager, Platform, View} from "react-native";
import {connect} from "react-redux";
import {Button, Container, Fab, Icon, Input, Tab, TabHeading, Tabs} from "native-base";
import {actions} from "react-native-navigation-redux-helpers";
import GroupFeedHeader from "./groupFeedHeader";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";
import InstanceComment from "./instancesComment";
import {getFeeds} from "../../../selectors/groupFeedsSelector";
import * as commentAction from "../../../actions/commentsGroup";
import * as instanceGroupCommentsAction from "../../../actions/instanceGroupComments"
import {ScrolTabView} from '../../../ui/index'
import GroupFeedComponent from './groupsFeeds'
import navigationUtils from '../../../utils/navigationUtils'
import formUtils from '../../../utils/fromUtils'
import ThisText from "../../../ui/ThisText/ThisText";
import strings from "../../../i18n/i18n"
class GroupFeed extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            messsage: '',
            showEmoji: false,
            iconEmoji: 'emoji-neutral',
            showChat: false,
            page: 0
        };
        this.handlePick = this.handlePick.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));
        const {navigation, feeds} = this.props;
        const group = navigation.state.params.group;
        this.props.actions.setCurrentGroup(group._id);
        this.props.actions.clearReplyInstance();
        if (this.props.navigation.state.params.chat) {
            this.setState({page: this.getChatTab()})
        }
        InteractionManager.runAfterInteractions(() => {
            if (!feeds[group._id] || (feeds[group._id] && feeds[group._id].length === 0)) {
                this.props.actions.setFeeds(group, feeds[group._id]);
            }
        });
        //workaround for hebrew support
        let item = this.props.navigation.state.params.instanceItem;
        if (item) {
            this.props.actions.setReplayInstance(item);
        }
    }

    handleBack() {
        this.props.actions.setCurrentGroup('');
    }

    handlePick(emoji) {
        let message = this.state.messsage;
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                messsage: message + emoji,
            })
        });
    }

    navigateToAdd() {
        const group = this.props.navigation.state.params.group;
        navigationUtils.doNavigation(this.props.navigation, 'PostForm', {group: group});
    }

    navigateToChat(item) {
        if (I18nManager.isRTL && (Platform.OS === 'android')) {
            //workaround for hebrew support
            const group = this.props.navigation.state.params.group;
            this.props.navigation.navigate('GroupFeed', {chat: true, group: group, instanceItem: item});
        } else {
            this.props.actions.setReplayInstance(item);
            this.setState({page: 1});
        }
    }

    onChangeTab(tab) {
        this.setState({page: tab.i});
    }

    getChatTab() {
        if (I18nManager.isRTL && (Platform.OS === 'android')) {
            return 0;
        }
        return 1;
    }

    getFeedTab() {
        if (I18nManager.isRTL && (Platform.OS === 'android')) {
            return 1;
        }
        return 0;
    }

    render() {
        const {chatTyping, navigation,user} = this.props;
        const group = this.props.navigation.state.params.group;
        let groupTyping = undefined;
        if (chatTyping) {
            groupTyping = formUtils.getGroupTyping(chatTyping[group._id],user);
        }
        let chatDisabled = group.chat_policy === 'OFF';
        let initPage = this.getFeedTab();
        if (this.props.navigation.state.params.chat) {
            initPage = this.getChatTab();
        }
        return (
            <Container style={{backgroundColor: '#ebebeb'}}>
                <GroupFeedHeader navigation={navigation} role={navigation.state.params.role}
                                 item={navigation.state.params.group}/>

                {chatDisabled ? <GroupFeedComponent tabLabel="promotions" navigation={this.props.navigation}
                                                    group={this.props.navigation.state.params.group}/> :

                    <View style={{flex: 1,}}>
                        {groupTyping && <View style={{marginLeft:10,marginRight:10,backgroundColor:'white',justifyContent:'center',alignItems:'flex-start'}}><ThisText style={{ backgroundColor:'white',justifyContent:'center',alignItems:'center',fontWeight: '300', color: '#2db6c8'}}>{strings.typingMessage.formatUnicorn(groupTyping)}</ThisText></View>}

                        {I18nManager.isRTL && (Platform.OS === 'android') ?
                            <ScrolTabView initialPage={initPage}
                                          page={this.state.page}
                                          onChangeTab={this.onChangeTab.bind(this)}
                                          tabBarBackgroundColor='white'
                                          tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>

                                <InstanceComment tabLabel="promotions" navigation={this.props.navigation}
                                                 group={this.props.navigation.state.params.group}/>
                                <GroupFeedComponent tabLabel={'chat'} navigation={this.props.navigation}
                                                    navigateToChat={this.navigateToChat.bind(this)}
                                                    navigateToAdd={this.navigateToAdd.bind(this)}
                                                    group={this.props.navigation.state.params.group}/>
                            </ScrolTabView> :
                            <ScrolTabView initialPage={initPage}
                                          page={this.state.page}
                                          onChangeTab={this.onChangeTab.bind(this)}
                                          tabBarBackgroundColor='white'
                                          tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>

                                <GroupFeedComponent navigateToChat={this.navigateToChat.bind(this)}
                                                    tabLabel="promotions" navigation={this.props.navigation}
                                                    navigateToAdd={this.navigateToAdd.bind(this)}
                                                    group={this.props.navigation.state.params.group}/>

                                <InstanceComment tabLabel={'chat'} navigation={this.props.navigation}
                                                 group={this.props.navigation.state.params.group}/>

                            </ScrolTabView>
                        }
                    </View>
                }

            </Container>



        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'GroupFeed') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        showTopLoader: state.groups.showTopLoader,
        user: state.user.user,
        loadingDone: state.groups.loadingDone,
        postUpdated: state.postForm,
        location: state.phone.currentLocation,
        currentScreen: state.render.currentScreen,
        chatTyping: state.groups.chatTyping,
        shouldRender: state.groups.shouldRender,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch),
        instanceGroupCommentsAction: bindActionCreators(instanceGroupCommentsAction, dispatch)
    })
)(GroupFeed);



