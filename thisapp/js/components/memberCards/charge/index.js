import React, {Component} from 'react';
import {BackHandler, Image, Platform, ScrollView, View} from 'react-native';
import { PromotionSeperator, ThisText,FormHeader} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import {connect} from 'react-redux';
import StyleUtils from "../../../utils/styleUtils";
import CardItem from '../list-item/index'


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
    }

    async realize() {
        this.props.navigation.goBack();
    }



    render() {
        let card = this.props.navigation.state.params.card;

        return (
            <ScrollView>
                <FormHeader showBack  navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/>
                <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>


                    <CardItem  noAction item={card}/>
                    <View style={{marginTop: 5, flex: 0.2, width: StyleUtils.getWidth() - 30, height: 20,}}>

                        <PromotionSeperator narrowWidth={StyleUtils.scale(30)}/>
                    </View>
                    <View style={{
                        marginBottom: 5,
                        flex: 4,
                        width: StyleUtils.getWidth() - 30,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ThisText style={{fontSize: StyleUtils.scale(14)}}>{strings.RealizeMessage1}</ThisText>
                        <ThisText style={{fontSize: StyleUtils.scale(14)}}>{strings.RealizeMessage2}</ThisText>
                        {this.state.image &&
                        <Image style={{
                            width: StyleUtils.scale(300),
                            height: StyleUtils.scale(300),
                            resizeMode: Image.resizeMode.contain,
                        }} source={{uri: this.state.image.qrcode}}/>
                        }
                    </View>


                </View>

            </ScrollView>

        );
    }
}

export default connect(
    state => ({
        update: state.myPromotions.update,
        myPromotions: state.myPromotions.feeds,
        feedToSavedFeed: state.myPromotions.feedToSavedFeed,
    })
)(ChargeCard);
