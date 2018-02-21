import React, {Component} from "react";
import {Dimensions, View,Text} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {getFeeds} from "../../../selectors/commentsSelector";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/commentsGroup";
import styles from './styles'
import {ChatMessage, MessageBox, PromotionHeader,ThisText} from '../../../ui/index';
import {Thumbnail} from 'native-base';
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
import strings from '../../../i18n/i18n';
import Tasks from '../../../tasks/tasks'
class instancesComment extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {comments, group,actions} = this.props;
        if (!comments[group._id] || (comments[group._id] && comments[group._id].length ===0)) {
            actions.setNextFeeds(group);
        }
    }

    setNextFeed() {
        const {group, actions} = this.props;
        actions.setNextFeeds(group);
    }

    _onPressButton(message) {
        const {group, actions} = this.props;
        actions.sendMessage(group._id, message)
    }

    renderItem(renderItem) {
        let item = renderItem.item;
        if (item.message) {
            const {user} = this.props;
            if(!user){
                return <View></View>
            }
            let isUser = item.message.actor === user._id;
            let messageItem = {
                name: item.message.name,
                avetar: item.message.logo,
                message: item.message.description,
                date: item.message.date,
                isUser: isUser
            };
            return <View style={{backgroundColor: 'white', flex: 1}}>
                <ChatMessage key={item.message.id}
                             item={messageItem}/>
            </View>
        } else {
            return <View style={styles.comments_promotions}>
                {item.instance.promotion && <PromotionHeader type={item.instance.promotion} feed titleText={item.instance.promotionTitle}
                                 titleValue={item.instance.promotionValue} term={item.instance.promotionTerm}/>}

                {item.instance.avetar &&
                <View style={{flexDirection: 'row',margin:4, borderRadius:10,backgroundColor: "#c9edf2", height:60, width: width -15}}>

                    <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                        <Thumbnail small source={item.instance.avetar}/>
                    </View>
                    <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                        <ThisText>{item.instance.name} {strings.Posted} </ThisText>
                        <ThisText>{item.instance.title}</ThisText>
                    </View>
                </View>
                }

            </View>
        }
    }

    render() {
        const {group, comments, navigation, actions, update, loadingDone, showTopLoader, allState} = this.props;
        console.log('group comments rendered')
        return <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <GenericFeedManager feeds={comments[group._id]}
                                    scrolToEnd
                                    entity={group}
                                    navigation={navigation}
                                    setNextFeeds={this.setNextFeed.bind(this)}
                                    actions={actions}
                                    update={update}
                                    showTopLoader={showTopLoader[group._id]}
                                    loadingDone={loadingDone[group._id]}
                                    ItemDetail={this.renderItem.bind(this)}/>
            </View>

            <View>
                <MessageBox onPress={this._onPressButton.bind(this)}/>
            </View>
        </View>
    }
}

export default connect(
    state => ({
        comments: getFeeds(state),
        loadingDone: state.comments.loadingDone,
        showTopLoader: state.comments.showTopLoader,
        update: state.comments.update,
        user: state.user.user,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentAction, dispatch)
    })
)(instancesComment);



