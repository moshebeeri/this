import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Header,
    Icon,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Thumbnail,
    View
} from 'native-base';
import GenericFeedManager from '../generic-feed-manager/index'
import {bindActionCreators} from "redux";
import {getFeeds} from '../../selectors/myPromotionsSelector'
import * as promotionAction from "../../actions/myPromotions";
import {connect} from 'react-redux';
import FeedPromotion from '../generic-feed-manager/generic-feed/feed-components/feedPromotion'

class MyPromotions extends Component {
    constructor(props) {
        super(props);
    }

    renderItem(item) {
        const {navigation, location} = this.props;
        return <FeedPromotion refresh={this.refresh.bind(this)}
                              location={location}
                              hideSocial
                              navigation={navigation} item={item.item}
                              realize={this.realize.bind(this, item.item)}
        />
    }
    shouldComponentUpdate(){
        if(this.props.currentScreen ==='home' && (this.props.selectedTab === 1 || this.props.selectedTab === 2)){
            return true;
        }
        return false;
    }
    refresh() {
    }

    realize(item) {
        this.props.navigation.navigate('realizePromotion', {item: item})
    }

    componentWillMount() {
        const {feeds, actions, firstTime} = this.props;
        if (firstTime || feeds.length === 0) {
            actions.setNextFeeds(feeds);
        }
    }

    render() {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, user} = this.props;
        return (
            <GenericFeedManager
                navigation={navigation}

                loadingDone={loadingDone}
                showTopLoader={showTopLoader}
                userFollowers={userFollower}
                feeds={feeds}
                actions={actions}
                token={token}
                entity={user}
                title='Feeds'
                ItemDetail={this.renderItem.bind(this)}>

            </GenericFeedManager>

        );
    }
}

const mapStateToProps = state => {
    return {
        userFollower: state.user.followers,
        update: state.myPromotions.update,
        user: state.user.user,
        feeds: getFeeds(state),
        showTopLoader: state.myPromotions.showTopLoader,
        loadingDone: state.myPromotions.loadingDone,
        myPromotions: state.myPromotions,
        firstTime: state.myPromotions.firstTime,
        location: state.phone.currentLocation,
        selectedTab:state.mainTab.selectedTab,
        currentScreen:state.render.currentScreen,

    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(MyPromotions);