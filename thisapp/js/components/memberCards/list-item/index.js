import React, {Component} from 'react';
import {Image} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Thumbnail,
    Title,
    View
} from 'native-base';
import stylesPortrate from './styles'
import StyleUtils from '../../../utils/styleUtils'
import {BusinessHeader, ImageController, SubmitButton, ThisText} from '../../../ui/index';
import LinearGradient from 'react-native-linear-gradient';
import navigationUtils from '../../../utils/navigationUtils'

export default class CardListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.createCard(this.props.item);
    }

    chargeCard(card) {
        navigationUtils.doNavigation(this.props.navigation, 'ChargeCard',{card:card});

    }


    createCard(card) {
        const {noAction, showStats,image} = this.props;
        let noProfile = false;
        let businessView = false;
        if (noAction) {
            noProfile = true;
            businessView = true;
        }
        const cardBusiness = card.business ? card.business : card.cardType.entity.business
        const styles = this.createStyle();
        let source = undefined;
        if(image){
            source = {uri: image.path};
        }else{
            if(cardBusiness && cardBusiness.pictures && Object.keys(cardBusiness.pictures).length > 0){
                source = {uri: cardBusiness.pictures[Object.keys(cardBusiness.pictures).length - 1].pictures[0]};
            }
            if(card.cardType && card.cardType.pictures && card.cardType.pictures.length > 0){
                source = {uri: card.cardType.pictures[Object.keys(card.cardType.pictures).length - 1].pictures[0]};

            }
        }

        return <View style={[styles.promotion_container, {
            marginTop: 0.5,
            marginBottom: 9.5,
            width: StyleUtils.getWidth()
        }]}>


            <View style={[styles.promotion_card, {
                padding: 5,
                borderWidth: 1,
                borderRadius: 20,
                // borderColor: '#ddd',
                borderColor: 'gray',
                borderBottomWidth: 0,
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.2,
                shadowRadius: 5,
                height: StyleUtils.scale(200),
                elevation: 10,
                overflow: 'hidden',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: StyleUtils.getWidth() - 15
            }]}>

                {source &&
                <ImageController
                    style={[styles.bannerImageContainer, {width: StyleUtils.getWidth() - 20}]} resizeMode="cover"
                    source={source}>

                </ImageController>}
                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                                locations={[0, 0.8]}
                                colors={['#00000099', 'transparent']} style={{
                    height: StyleUtils.scale(90),
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    top: 0,
                    backgroundColor: 'transparent',
                    width: StyleUtils.getWidth() - 15
                }}>
                    <BusinessHeader navigation={this.props.navigation} business={cardBusiness}
                                    businessLogo={cardBusiness.logo}
                                    businessName={cardBusiness.name} noMargin
                                    headerWidth={100}
                                    noProfile={noProfile}
                                    hideMenu
                                    businessView={businessView}
                                    bgColor={'transparent'}
                                    size={60}
                                    textColor={'white'}/>

                </LinearGradient>
                <View style={{
                    height: StyleUtils.scale(40),
                    position: 'absolute',
                    top: StyleUtils.scale(100),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    width: StyleUtils.getWidth() - 15
                }}>
                    {showStats ? <View style={{alignItems:'center',justifyContent:'center'}}>
                        <ThisText
                            style={{color: 'white', fontSize:  StyleUtils.scale(20), fontWeight: 'bold'}}>Members</ThisText><ThisText
                            style={{color: 'white', fontSize:  StyleUtils.scale(20), fontWeight: 'bold'}}>{card.members}</ThisText>
                        </View> :
                        <ThisText style={{color: 'white', fontSize:  StyleUtils.scale(40), fontWeight: 'bold'}}>{card.points}</ThisText>}

                </View>


                <LinearGradient start={{x: 1, y: 1}} end={{x: 1, y: 0}}
                                locations={[0, 0.8]}
                                colors={['#00000099', 'transparent']} style={{
                    height: StyleUtils.scale(45),
                    position: 'absolute',
                    bottom: 0,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    width: StyleUtils.getWidth()
                }}>
                    {!noAction && <View style={{marginLeft: StyleUtils.scale(20)}}>
                        <SubmitButton textColor={'white'} title={'CHARGE'} color={'transparent'}
                                      onPress={() => this.chargeCard(card)}/>
                    </View>}

                </LinearGradient>

            </View>


        </View>;
    }

    createStyle() {
        return stylesPortrate;
    }
}
