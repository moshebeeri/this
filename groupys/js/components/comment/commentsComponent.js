import React, {Component} from "react";
import {
    Image,
    TextInput,
    Dimensions,
    Platform,
    View,
    Keyboard,
    TouchableNativeFeedback,
    TouchableOpacity,
    KeyboardAvoidingView
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Icon, Button, Text, Input, Thumbnail} from "native-base";
import GenericFeedManager from "../generic-feed-manager/index";
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import styles from "./styles";
import Icon2 from "react-native-vector-icons/Entypo";
import {bindActionCreators} from "redux";
import NestedScrollView from "react-native-nested-scrollview";
import * as commentEntitiesAction from "../../actions/commentsEntities";
import {getFeeds} from "../../selectors/commentsEntitiesSelector";
import EmojiPicker from "react-native-emoji-picker-panel";
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
class CommentsComponent extends Component {
    constructor(props) {
        super(props);
        let showComment = false;
        if (props.showComments) {
            showComment = true;
        }
        this.state = {
            messsage: '',
            showComment: showComment,
            showEmoji: false,
            iconEmoji: 'emoji-neutral',
            componentHight: 400,
            keyboardOn:false,
            keyboardSize:0

        };
        this.handlePick = this.handlePick.bind(this);
    }

    componentWillMount() {
        const item = this.getInstance();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        const {navigation, actions} = this.props;
        actions.fetchTopComments(item.entities, item.generalId);
    }

    _keyboardDidShow(e) {
        let newSize =height - e.endCoordinates.height
        this.setState({
            keyboardOn: true,
            keyboardSize:newSize
        })
    }

    _keyboardDidHide() {
        this.setState({
            keyboardOn: false
        })
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

    getInstance() {
        if (this.props.instance) {
            return this.props.instance;
        }
        if (this.props.navigation.state.params.instance) {
            return this.props.navigation.state.params.instance;
        }
        return this.props.item;
    }

    _onPressButton() {
        const item = this.getInstance();
        const {group, actions} = this.props;
        let message = this.state.messsage;
        if (message) {
            actions.sendMessage(item.entities, item.generalId, message);
        }
        this.setState({
            messsage: '',
        })
    }

    showComments() {
        let show = !this.state.showComment;
        this.setState({
            showComment: show
        })
    }

    render() {
        const item = this.getInstance();
        const promotion = this.getBannerComponent(item);
        const colorStyle = {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        }
        const promotionType = <Text style={colorStyle}>{item.promotion}</Text>
        const showComment = this.state.showComment;
        const arrowIcon = this.getArrowComponent(showComment);
        const commentsView = this.createCommentView(showComment, item);
        const showMessageInput = this.createMessageComponent(showComment);
        const showEmoji = this.createEmojiComponent(showComment, this.state.showEmoji);
        const style = this.createStyle(showComment,this.state.keyboardOn,this.state.keyboardSize);
        return (
            <View style={style}>
                <View style={styles.comments_promotions}>
                    <View style={styles.comments_promotions}>
                        {promotion}
                    </View>
                    <View style={styles.comment_description_container}>
                        <Text style={styles.promotion_text_description}>{item.name}</Text>
                        {promotionType}
                        <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                    </View>
                    <View style={styles.comment_colapse}>
                        <Button onPress={() => this.showComments()} style={styles.icon} transparent>

                            <Icon2 style={{fontSize: 35, color: "#dadada"}} name={arrowIcon}/>
                        </Button>
                    </View>
                </View>
                {commentsView}
                {showMessageInput}
                {showEmoji}
            </View>



        );
    }

    createStyle(showComment, keboardOn,keyboardSize) {
        if (showComment) {
            if (keboardOn) {
                return {
                    height: keyboardSize - 100, backgroundColor: '#ebebeb'
                }
            }
            return {
                height: vh * 80, backgroundColor: '#ebebeb'
            }
        }
        return {
            height: vh * 15, backgroundColor: '#ebebeb'
        };
    }
    createEmojiComponent(showComment, showEmoji) {
        if (showComment) {
            return <EmojiPicker stylw={{height: 100}} visible={showEmoji} onEmojiSelected={this.handlePick}/>
        }
        return undefined;
    }

    createMessageComponent(showComment) {
        if (showComment) {
            return <View style={styles.message_container}>
                <View style={ {backgroundColor: 'white', flexDirection: 'row'}}>
                    <Button onPress={() => this._onPressButton()} style={styles.icon} transparent>

                        <Icon style={{fontSize: 35, color: "#2db6c8"}} name='send'/>
                    </Button>
                    <Input style={{width: 300}} value={this.state.messsage} onFocus={this.hideEmoji.bind(this)}
                           blurOnSubmit={true} returnKeyType='done' ref="3"
                           onSubmitEditing={this._onPressButton.bind(this)}
                           onChangeText={(messsage) => this.setState({messsage})} placeholder='write text'/>


                    <Button onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize: 35, color: "#2db6c8"}} name={this.state.iconEmoji}/>
                    </Button>

                </View>

            </View>
        }
        return undefined;
    }

    nextCommentPage() {
        const item = this.getInstance();
        const {actions, group}= this.props;
        actions.setNextFeeds(feeds[item.generalId], item.entities, item.generalId)
    }

    createCommentView(showComment, item) {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, group} = this.props;
        if (Platform.OS == 'android') {
            return this.createAndroidScroller(feeds[item.generalId], 30)
        }
        if (showComment) {
            return <GenericFeedManager
                navigation={navigation}

                loadingDone={loadingDone[group._id][item.id]}
                showTopLoader={false}
                userFollowers={userFollower}
                feeds={feeds[group._id][item.id]}
                setNextFeeds={this.nextCommentPage.bind(this)}
                actions={actions}
                token={token}
                entity={item}
                group={group}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>
        }
        return undefined;
    }

    getArrowComponent(showComment) {
        if (showComment) {
            return "chevron-small-up";
        }
        return "chevron-small-down";
        ;
    }

    getBannerComponent(item) {
        if (item.banner) {
            return <Thumbnail square={true} size={50} source={{uri: item.banner.uri}}/>
        }
        return undefined;
    }

    createAndroidScroller(feeds, size) {
        if (feeds && feeds.length > 0) {
            let body = feeds.map(feed => this.renderItem(feed))
            return <NestedScrollView style={{height: vh * size}}>{body}</NestedScrollView>
        } else {
            return <NestedScrollView style={{height: vh * size}}></NestedScrollView>
        }
    }

    renderItem(item) {
        const {navigation, token, userFollowers, group, actions, entity} = this.props;
        return <GenericFeedItem
            key={item.id}
            user={entity}
            token={token}
            userFollowers={userFollowers}
            group={group}
            navigation={navigation}
            item={item}
            fetchTopList={this.fetchTopList.bind(this)}
            actions={actions}/>
    }

    async fetchTopList(id) {
        const item = this.getInstance();
        const {token, feeds, group, actions} = this.props;
        if (id == feeds[item.generalId][0].fid) {
            actions.fetchTop(feeds[item.generalId], token, item.entities, item.generalId)
        }
    }
}
export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        showTopLoader: state.commentInstances.showTopLoader,
        loadingDone: state.commentInstances.groupLoadingDone,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentEntitiesAction, dispatch)
    })
)(CommentsComponent);



