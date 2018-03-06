import React, {Component} from 'react';
import {View} from 'react-native';
import GenericFeedManager from '../generic-feed-manager/index'
import {bindActionCreators} from "redux";
import {getFeeds} from '../../selectors/myPromotionsSelector'
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import * as promotionAction from "../../actions/myPromotions";
import {connect} from 'react-redux';
import FeedPromotion from '../generic-feed-manager/generic-feed/feed-components/feedPromotion'

class MyPromotions extends Component {
    constructor(props) {
        super(props);
        this.state = {render: true}
    }

    componentWillMount() {
        this.props.actions.setFirstTime();
    }

    renderItem(item) {
        const {navigation, location, rawFeeds} = this.props;
        let isRealized = this.checkIfRealized(rawFeeds[item.item.id])
        return <View key={item.item.id}>
            <FeedPromotion refresh={this.refresh.bind(this)}
                           location={location}
                           isRealized={isRealized}
                           hideSocial
                           shouldUpdate={isRealized}
                           navigation={navigation} item={item.item}
                           realize={this.realize.bind(this, item.item)}
            /></View>
    }

    refresh() {
    }





    realize(item) {
        this.props.navigation.navigate('realizePromotion', {item: item})
    }

    render() {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, user, rawFeeds,location} = this.props;
        return (
            <GenericFeedManager
                navigation={navigation}
                realize={this.realize.bind(this)}
                rawFeed={rawFeeds}
                loadingDone={loadingDone}
                showTopLoader={showTopLoader}
                userFollowers={userFollower}
                feeds={feeds}
                location={location}
                actions={actions}
                token={token}
                entity={user}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>

        );
    }
}

const mapStateToProps = state => {
    return {
        userFollower: state.user.followers,
        update: state.myPromotions.update,
        shouldRender: state.myPromotions.shouldRender,
        user: state.user.user,
        feeds: getFeeds(state),
        rawFeeds: state.myPromotions.feeds,
        showTopLoader: state.myPromotions.showTopLoader,
        loadingDone: state.myPromotions.loadingDone,
        myPromotions: state.myPromotions,
        firstTime: state.myPromotions.firstTime,
        location: state.phone.currentLocation,
        selectedTab: state.mainTab.selectedTab,
        currentScreen: state.render.currentScreen,
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(MyPromotions);