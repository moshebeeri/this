import React, {Component} from "react";
import {
    Image,
    TextInput,
    Platform,
    View,
    Keyboard,
    TouchableNativeFeedback,
    TouchableOpacity,
    BackHandler
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Container, Icon, Button, Text, Input} from "native-base";
import GroupFeedHeader from "./groupFeedHeader";
import GenericFeedManager from "../../generic-feed-manager/index";
import GenericFeedItem from "../../generic-feed-manager/generic-feed";
import styles from "./styles";
import Icon2 from "react-native-vector-icons/Entypo";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";
import UiTools from "../../../api/feed-ui-converter";
import GroupApi from "../../../api/groups";
import EmojiPicker from "react-native-emoji-picker-panel";
import InstanceComment from "./instancesComment";
import {getFeeds} from "../../../selectors/groupFeedsSelector";

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

    async _onPressButton() {
        const {navigation, actions} = this.props;
        let groupid = navigation.state.params.group._id;
        let message = this.state.messsage;
        if (message) {
            actions.sendMessage(groupid, message)
            this.setState({
                messsage: '',
                showEmoji: false,
                iconEmoji: 'emoji-neutral'
            })
        }
    }

    handlePick(emoji) {
        let message = this.state.messsage;
        this.setState({
            messsage: message + emoji,
        });
    }

    showEmoji() {
        let show = !this.state.showEmoji;
        if (show) {
            this.setState({
                showEmoji: show,
                iconEmoji: "keyboard"
            })
        } else {
            Keyboard.dismiss();
            this.setState({
                showEmoji: show,
                iconEmoji: "emoji-neutral"
            })
        }
    }

    hideEmoji() {
        this.setState({
            showEmoji: false,
            iconEmoji: 'emoji-neutral'
        })
    }

    selectPromotions() {
        this.setState({
            showChat: false
        })
    }

    selectChat() {
        this.setState({
            showChat: true
        })
    }

    render() {
        let body = this.createGroupFeeds();
        let promotionStyle = styles.נpromotionButtonOn;
        let textPromotionStyle = styles.group_text_on;
        let textChatStyle = styles.group_text_off;
        let chatStyle = styles.נchatButtonOFf
        if (this.state.showChat) {
            body =
                <InstanceComment navigation={this.props.navigation} group={this.props.navigation.state.params.group}/>
            promotionStyle = styles.promotionButtonOff;
            chatStyle = styles.chatButtonOn
            textPromotionStyle = styles.group_text_off;
            textChatStyle = styles.group_text_on;
        }
        return (
            <Container style={{backgroundColor: '#ebebeb'}}>

                <View style={styles.headerTabContainer}>
                    <View style={styles.headerTabInnerContainer}>
                        <TouchableOpacity onPress={this.selectPromotions.bind(this)}>
                            <View style={promotionStyle}>
                                <Text style={textPromotionStyle}>Posts</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.selectChat.bind(this)}>
                            <View style={chatStyle}>
                                <Text style={textChatStyle}>Promotions</Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                </View>
                {body}

            </Container>



        );
    }

    createGroupFeeds() {
        const {navigation, feeds, userFollower, actions, token, loadingDone,location, showTopLoader} = this.props;
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

            <View style={styles.itemborder}>
                <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
                    <Button onPress={() => this._onPressButton()} style={styles.icon} transparent>

                        <Icon style={{fontSize: 35, color: "#2db6c8"}} name='send'/>
                    </Button>
                    <Input value={this.state.messsage} onFocus={this.hideEmoji.bind(this)} blurOnSubmit={true}
                           returnKeyType='done' ref="3" onSubmitEditing={this._onPressButton.bind(this)}
                           onChangeText={(messsage) => this.setState({messsage})} placeholder='write text'/>


                    <Button onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize: 35, color: "#2db6c8"}} name={this.state.iconEmoji}/>
                    </Button>

                </View>

            </View>
            <EmojiPicker stylw={{height: 100}} visible={this.state.showEmoji} onEmojiSelected={this.handlePick}/>
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
        actions: bindActionCreators(groupAction, dispatch)
    })
)(GroupFeed);



