import React, {Component} from "react";
import {Dimensions, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {getFeeds} from "../../../selectors/commentsSelector";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/commentsGroup";
import styles from './styles'
import {ChatMessage, MessageBox, PromotionHeader} from '../../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

class instancesComment extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {comments, group, actions} = this.props;
        this.setNextFeed();
    }

    setNextFeed(){

        const {comments, group, actions} = this.props;

        if (comments[group._id]) {
            actions.setNextFeeds(comments[group._id].filter(comment => comment.message), group);
        } else {
            actions.setNextFeeds(comments[group._id], group);
        }
    }

    _onPressButton(message) {
        const { group, actions} = this.props;
        actions.sendMessage(group._id,message)
    }

    renderItem(renderItem) {
        let item = renderItem.item;
        if (item.message) {
            const {user} = this.props;
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
                <PromotionHeader type={item.instance.promotion} feed titleText={item.instance.promotionTitle}
                                 titleValue={item.instance.promotionValue} term={item.instance.promotionTerm}/>
            </View>
        }
    }

    render() {
        const {group, comments, navigation, actions, update, loadingDone, showTopLoader, allState} = this.props;
        if (!comments[group._id]) {
            return <View>

                    <GenericFeedManager feeds={new Array()}
                                        entity={group}
                                        setNextFeeds={this.setNextFeed.bind(this)}
                                        navigation={navigation}
                                        actions={actions}
                                        update={update}
                                        showTopLoader={showTopLoader[group._id]}
                                        loadingDone={loadingDone[group._id]}
                                        ItemDetail={this.renderItem.bind(this)}/>


            </View>
        }
        return <View style={{flex:1}}>
            <View style={{flex:1}}>
                <GenericFeedManager feeds={comments[group._id]}
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
        user: state.authentication.user,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentAction, dispatch)
    })
)(instancesComment);



