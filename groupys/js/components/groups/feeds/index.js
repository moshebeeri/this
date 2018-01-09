import React, {Component} from "react";
import {BackHandler, View,I18nManager,Platform} from "react-native";
import {connect} from "react-redux";
import {Button, Container, Fab, Icon, Input, Tab, TabHeading, Tabs, Text} from "native-base";
import {actions} from "react-native-navigation-redux-helpers";
import GroupFeedHeader from "./groupFeedHeader";

import styles from "./styles";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";
import InstanceComment from "./instancesComment";
import {getFeeds} from "../../../selectors/groupFeedsSelector";
import * as commentAction from "../../../actions/commentsGroup";
import strings from "../../../i18n/i18n"

import PageRefresher from '../../../refresh/pageRefresher'
import {ScrolTabView} from '../../../ui/index'
import GroupFeedComponent from './groupsFeeds'
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
            showChat: false
        };
        this.handlePick = this.handlePick.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));
        const {navigation, feeds} = this.props;
        const group = navigation.state.params.group;
        PageRefresher.addGroupsFeed(group._id);
        PageRefresher.visitedGroupFeeds(group._id);
        if (!feeds[group._id] || (feeds[group._id] && feeds[group._id].length === 0)) {
            this.props.actions.setFeeds(group, feeds[group._id]);
        }

        this.props.actions.clearUnreadPosts(group);
    }

    handleBack() {
        //this.props.actions.fetchGroups();
    }

    handlePick(emoji) {
        let message = this.state.messsage;
        this.setState({
            messsage: message + emoji,
        });
    }

    selectPromotions() {
        this.setState({
            showChat: false
        })
    }

    navigateToAdd() {
        const group = this.props.navigation.state.params.group;
        this.props.navigation.navigate('PostForm', {group: group})
    }

    changeTab(tab) {
        const {navigation, commentGroupAction} = this.props;
        const group = navigation.state.params.group;
        if(tab.i === 1){
            PageRefresher.upSertGroupsChat(group._id);
            commentGroupAction.clearUnreadComments(group);
        }
        this.setState({
            showChat: !this.state.showChat
        })
        if (!this.state.showChat) {
            commentGroupAction.fetchTopComments(group)
        }
    }

    allowPost(group) {
        switch (group.entity_type) {
            case 'USERS':
                return true;
            case 'BUSINESS':
                if (group.role && (group.role === "owner" || group.role === "OWNS" || group.role === "Admin" )) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    render() {

        let initPage =0;
        if(this.props.navigation.state.params.chat){
            initPage = 1;
        }
        if(I18nManager.isRTL && (Platform.OS==='android')){
            if(this.props.navigation.state.params.chat){
                initPage =0;
            }else {
                initPage = 1;
            }
        }


        return (
            <Container style={{backgroundColor: '#ebebeb'}}>


                { I18nManager.isRTL && (Platform.OS==='android') ?  <ScrolTabView  initialPage={initPage} onChangeTab={this.changeTab.bind(this)} tabBarBackgroundColor='white'
                                                                                   tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>
                         <InstanceComment tabLabel={strings.Posts} navigation={this.props.navigation}
                                         group={this.props.navigation.state.params.group}/>
                       <GroupFeedComponent tabLabel={strings.Chat} navigation={this.props.navigation}
                                  group={this.props.navigation.state.params.group}/>
                    </ScrolTabView> :
                    <ScrolTabView  initialPage={initPage} onChangeTab={this.changeTab.bind(this)} tabBarBackgroundColor='white'
                                   tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>
                        <GroupFeedComponent tabLabel={strings.Posts} navigation={this.props.navigation}
                                   group={this.props.navigation.state.params.group}/>

                        <InstanceComment tabLabel={strings.Chat} navigation={this.props.navigation}
                                         group={this.props.navigation.state.params.group}/>

                    </ScrolTabView>
                }

            </Container>



        );
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
        location: state.phone.currentLocation
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch)
    })
)(GroupFeed);



