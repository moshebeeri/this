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

class GroupFeed extends Component {
    static navigationOptions = ({navigation}) => ({
        header: <GroupFeedHeader navigation={navigation} role={navigation.state.params.role}
                                 item={navigation.state.params.group}/>
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
        this.props.actions.clearReplyInstance();
        if (this.props.navigation.state.params.chat) {
            this.setState({page: this.getChatTab()})
        }
        InteractionManager.runAfterInteractions(() => {
            if (!feeds[group._id] || (feeds[group._id] && feeds[group._id].length === 0)) {
                this.props.actions.setFeeds(group, feeds[group._id]);
            }
            this.props.actions.clearUnreadPosts(group);
            this.props.instanceGroupCommentsAction.stopListenForChat();
        });
    }

    handleBack() {
        InteractionManager.runAfterInteractions(() => {
            this.props.instanceGroupCommentsAction.stopListenForChat();
        });
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
        this.props.actions.setReplayInstance(item);
        if (I18nManager.isRTL && (Platform.OS === 'android')) {
            this.setState({page: 0});
        } else {
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

    render() {
        const group = this.props.navigation.state.params.group;
        let chatDisabled = group.chat_policy === 'OFF';
        let initPage = 0;
        if (this.props.navigation.state.params.chat) {
            initPage = this.getChatTab();
        }
        return (
            <Container style={{backgroundColor: '#ebebeb'}}>

                {chatDisabled ? <GroupFeedComponent tabLabel="promotions" navigation={this.props.navigation}
                                                    group={this.props.navigation.state.params.group}/> :
                    <View style={{flex: 1,}}>

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
        loadingDone: state.groups.loadingDone,
        postUpdated: state.postForm,
        location: state.phone.currentLocation,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch),
        instanceGroupCommentsAction: bindActionCreators(instanceGroupCommentsAction, dispatch)
    })
)(GroupFeed);



