import React, {Component} from 'react';
import {Button, Card, CardItem, Container, Content, Footer, Icon, Input, Item, List, ListItem, Text} from 'native-base';
import {Dimensions, Image, View,ScrollView} from 'react-native';
import PromotionApi from '../../api/promotion'
import {BusinessHeader, PromotionColumnHeader, PromotionSeperator} from '../../ui/index';
import strings from "../../i18n/i18n"
const deviceHeight = Dimensions.get('window').width;
let promotionApi = new PromotionApi()
import StyleUtils from "../../utils/styleUtils";

export default class RealizePromotion extends Component {
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
        let qrCode = await promotionApi.getPromotionQrcode(this.props.navigation.state.params.item.id);
        this.setState({
            image: qrCode
        })
    }

    async realize() {
        this.props.navigation.goBack();
    }

    render() {
        let item = this.props.navigation.state.params.item;
        return (
        <ScrollView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <BusinessHeader showBack navigation={this.props.navigation} business={item.business}
                                categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                businessName={item.businessName}/>


                <PromotionColumnHeader columnStyle type={item.promotion} feed titleText={item.promotionTitle}
                                       titleValue={item.promotionValue} term={item.promotionTerm}/>


                <View style={{flex: 0.2, width: StyleUtils.getWidth() - 30, height: 20,}}>

                    <PromotionSeperator narrowWidth={30}/>
                </View>
                <View style={{
                    marginBottom: 5,
                    flex: 4,
                    width: StyleUtils.getWidth()  - 30,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{strings.RealizeMessage1}</Text>
                    <Text>{strings.RealizeMessage2}</Text>
                    <Image style={{
                        width: 300,
                        height: 300,
                        resizeMode: Image.resizeMode.contain,
                    }} source={{uri: this.state.image.qrcode}}/>

                </View>
            </View>

        </ScrollView>

        );
    }
}
