import React, {Component} from 'react';
import {BackHandler, Image, Platform, ScrollView, View} from 'react-native';
import { PromotionSeperator, ThisText,FormHeader} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import {connect} from 'react-redux';
import StyleUtils from "../../../utils/styleUtils";
import CardItem from '../list-item/index'
import {bindActionCreators} from "redux";
import * as cardAction from "../../../actions/cardAction";
class ChargeCard extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            image: {
                qrcode: ''
                ,
            }
        };
    }

    async componentWillMount() {

    }

    handleBack() {
    }

    componentWillUnmount() {
        let card = this.props.navigation.state.params.card;
        if(!card.qrCode) {
            this.props.actions.setCardQrcCode(card);
        }

    }

    async realize() {
        this.props.navigation.goBack();
    }



    render() {
        const{memberCards} = this.props;
        const cardId = this.props.navigation.state.params.card._id;
        const card = memberCards.filter(card => card._id === cardId)[0];

        return (
            <ScrollView>
                <FormHeader showBack  navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/>
                <View style={{flex: 1,marginTop:2, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>


                    <CardItem  noAction item={card}/>
                    <View style={{marginTop: 0, flex: 0.2, width: StyleUtils.getWidth() - 30, height: StyleUtils.scale(15),}}>

                        <PromotionSeperator narrowWidth={StyleUtils.scale(30)}/>
                    </View>
                    <View style={{
                        flex: 4,
                        width: StyleUtils.getWidth() - 30,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ThisText style={{fontSize: StyleUtils.scale(14)}}>{strings.RealizeMessage1}</ThisText>
                        <ThisText style={{fontSize: StyleUtils.scale(14)}}>{strings.RealizeMessage2}</ThisText>
                        {card.qrCode &&
                        <Image style={{
                            width: StyleUtils.scale(250),
                            height: StyleUtils.scale(250),
                            resizeMode: Image.resizeMode.contain,
                        }} source={{uri: card.qrCode}}/>
                        }
                    </View>


                </View>

            </ScrollView>

        );
    }
}

export default connect(
    state => ({
        memberCards: state.memberCards.memberCards,
        update: state.memberCards.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(cardAction, dispatch),
    })
)(ChargeCard);
