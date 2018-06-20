import React, {Component} from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Fab, Header, Input, InputGroup, Item, Spinner, View} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import CardItem from './list-item/index'
import * as cardAction from "../../actions/cardAction";
import {getMyCards} from '../../selectors/memberCardsSelector'
import {bindActionCreators} from "redux";
import {FormHeader} from '../../ui/index';
import navigationUtils from '../../utils/navigationUtils'
import strings from "../../i18n/i18n"

class MemberCards extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    back() {
        this.props.navigation.goBack();
    }

    componentWillMount() {
        this.props.actions.setMyCards();
    }


    onBoardingPromotion() {
        const {business, navigation, onBoardingPromotion} = this.props;
        let addToBusiness = business;
        if (!addToBusiness) {
            addToBusiness = navigation.state.params.business;
        }
        navigationUtils.doNavigation(navigation, "addPromotions", {
            onBoardType: 'BUSINESS',
            business: addToBusiness,
            onBoardingPromotion: onBoardingPromotion[addToBusiness._id]
        });
    }

    render() {
        const {navigation, cards, actions, update, location} = this.props;
        return (
            <View style={{flex: 1}}>
                <FormHeader showBack navigation={this.props.navigation}
                            title='Member Cards' bgc="white"


                            titleColor="#FA8559" backIconColor="#FA8559"/>


                <GenericListManager rows={cards} navigation={navigation} actions={actions}
                                    update={update}
                                    noRefresh
                                    location={location}
                                    ItemDetail={CardItem}/>


            </View>
        );
    }
}

export default connect(
    state => ({
        cards: getMyCards(state),
        update: state.businesses.update,
        location: state.phone.currentLocation,
        promotionsLoading: state.promotions.loadingDone,
        proximityPromotion: state.promotions.proximityPromotion,
        onBoardingPromotion: state.promotions.onBoardingPromotion,
        followerProximity: state.promotions.followerProximity,
        promotionsChange: state.promotions,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(cardAction, dispatch),
    })
)(MemberCards);


