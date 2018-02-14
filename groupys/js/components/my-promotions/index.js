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
        this.state={render:true}
    }

    componentWillMount(){
        console.log('mount saved');
    }

    renderItem(item) {
        const {navigation, location,rawFeeds} = this.props;
        let isRealized = this.checkIfRealized(rawFeeds[item.item.id])

        return <FeedPromotion refresh={this.refresh.bind(this)}
                              location={location}
                              isRealized={isRealized}
                              hideSocial
                              navigation={navigation} item={item.item}
                              realize={this.realize.bind(this, item.item)}
        />
    }

    refresh() {
    }

    shouldComponentUpdate(){
        if(this.props.activeTab ==='savedPromotion' && this.props.shouldRender){

            this.props.actions.stopReneder();
            return true;

        }
        return false;
    }

    checkIfRealized(feed){
        let savedinstance = feed;
        if(feed.savedInstance){
            savedinstance = feed.savedInstance;
        }
        if(savedinstance.savedData && savedinstance.savedData && savedinstance.savedData.other ){
            return true;
        }
        if(savedinstance.savedData && savedinstance.savedData.punch_card && savedinstance.savedData.punch_card.number_of_punches){
            let remainPunches =  savedinstance.savedData.punch_card.number_of_punches - savedinstance.savedData.punch_card.redeemTimes.length;
            return remainPunches === 0;
        }

        return false;
    }

    realize(item) {
        this.props.navigation.navigate('realizePromotion', {item: item})
    }



    render() {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, user,activeTab} = this.props;
        console.log('render my PROMTOIONS');
        console.log(activeTab);
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
        shouldRender: state.myPromotions.shouldRender,
        user: state.user.user,
        feeds: getFeeds(state),
        rawFeeds: state.myPromotions.feeds,
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