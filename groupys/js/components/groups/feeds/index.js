import React, {Component} from "react";
import {BackHandler, View} from "react-native";
import {connect} from "react-redux";
import {Button, Container, Icon, Input, Tab, TabHeading, Tabs, Text} from "native-base";
import {actions} from "react-native-navigation-redux-helpers";
import GroupFeedHeader from "./groupFeedHeader";
import GenericFeedManager from "../../generic-feed-manager/index";
import GenericFeedItem from "../../generic-feed-manager/generic-feed";
import styles from "./styles";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";
import UiTools from "../../../api/feed-ui-converter";
import GroupApi from "../../../api/groups";
import InstanceComment from "./instancesComment";
import {getFeeds} from "../../../selectors/groupFeedsSelector";
import * as commentAction from "../../../actions/commentsGroup";
let uiTools = new UiTools();
let groupApi = new GroupApi();

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
        this.props.actions.setFeeds(group, feeds[group._id]);
    }

    handleBack() {
        this.props.actions.fetchGroups();
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

    changeTab() {
        const {navigation,commentGroupAction} = this.props;
        const group = navigation.state.params.group;
        this.setState({
            showChat: !this.state.showChat
        })

        if(!this.state.showChat){
            commentGroupAction.fetchTopComments(group)
        }
    }

    render() {
        let textPromotionStyle = styles.group_text_on;
        let textChatStyle = styles.group_text_off;

        if (this.state.showChat) {

            textPromotionStyle = styles.group_text_off;
            textChatStyle = styles.group_text_on;
        }
        return (
            <Container style={{backgroundColor: '#ebebeb'}}>

                <Tabs onChangeTab={this.changeTab.bind(this)}tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}
                      style={{backgroundColor: '#fff',}}>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={textPromotionStyle}>Posts</Text></TabHeading>}>
                        {this.createGroupFeeds()}
                    </Tab>
                    <Tab heading={<TabHeading
                        style={{justifyContent: 'center', alignItems: 'center', backgroundColor: "white"}}>
                        <Text  style={textChatStyle}>Chat</Text></TabHeading>}>
                        <InstanceComment navigation={this.props.navigation}
                                         group={this.props.navigation.state.params.group}/>
                    </Tab>

                </Tabs>

            </Container>



        );
    }

    createGroupFeeds() {
        const {navigation, feeds, userFollower, actions, token, loadingDone, location, showTopLoader} = this.props;
        const group = navigation.state.params.group;
        return <View style={styles.inputContainer}>
            <GenericFeedManager
                navigation={navigation}

                loadingDone={loadingDone[group._id]}
                showTopLoader={showTopLoader[group._id]}
                userFollowers={userFollower}
                feeds={feeds[group._id]}
                actions={actions}
                token={token}
                entity={group}
                group={group}
                location={location}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>


        </View>
    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        showTopLoader: state.groups.showTopLoader,
        loadingDone: state.groups.loadingDone,
        location: state.phone.currentLocation
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch)
    })
)(GroupFeed);



