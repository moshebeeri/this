import React, {Component} from 'react';
import {Button, Card, CardItem, Container, Content, Footer, Icon, Input, Item, List, ListItem, Text} from 'native-base';
import {BackHandler, Dimensions, Image, ScrollView, View} from 'react-native';
import PromotionApi from '../../api/promotion'
import {BusinessHeader, PromotionColumnHeader, PromotionSeperator} from '../../ui/index';
import strings from "../../i18n/i18n"
import {connect} from 'react-redux';
import instanceUtils from '../../utils/instanceUtils'
import StyleUtils from "../../utils/styleUtils";
import Tasks from '../../tasks/tasks'
import FeedUiConverter from "../../api/feed-ui-converter";

const deviceHeight = Dimensions.get('window').width;
let promotionApi = new PromotionApi()
let feedUiConverter = new FeedUiConverter();

class RealizePromotion extends Component {
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
        let id = this.props.navigation.state.params.item.id;
        if (this.props.navigation.state.params.id) {
            id = this.props.navigation.state.params.id;
        }
        let qrCode = await promotionApi.getPromotionQrcode(id);
        Tasks.realizeTaskStart(id);
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));
        this.setState({
            image: qrCode
        })
    }

    handleBack() {
        Tasks.realizeTaskstop();
    }

    componentWillUnmount() {
        Tasks.realizeTaskstop();
    }

    async realize() {
        Tasks.realizeTaskstop();
        this.props.navigation.goBack();
    }

    createItem(feed) {
        let savedinstance = feed;
        if (feed.savedInstance) {
            savedinstance = feed.savedInstance;
        }
        return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id)
    }

    render() {
        const {myPromotions} = this.props;
        let id = this.props.navigation.state.params.item.id;
        if (this.props.navigation.state.params.id) {
            id = this.props.navigation.state.params.id;
        }
        let item = this.props.navigation.state.params.item;
        let isRealized = false;
        if (myPromotions[id]) {
            item = this.createItem(myPromotions[id]);
            isRealized = instanceUtils.checkIfRealized(myPromotions[id]);
        }
        return (
            <ScrollView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <BusinessHeader backAction={this.handleBack.bind(this)} showBack navigation={this.props.navigation}
                                    business={item.business}
                                    categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                    businessName={item.businessName}/>


                    <PromotionColumnHeader item={item} columnStyle type={item.promotion} feed={true}
                                           titleText={item.promotionTitle}
                                           titleValue={item.promotionValue} term={item.promotionTerm}/>


                    <View style={{flex: 0.2, width: StyleUtils.getWidth() - 30, height: 20,}}>

                        <PromotionSeperator narrowWidth={30}/>
                    </View>
                    <View style={{
                        marginBottom: 5,
                        flex: 4,
                        width: StyleUtils.getWidth() - 30,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{strings.RealizeMessage1}</Text>
                        <Text>{strings.RealizeMessage2}</Text>
                        {this.state.image &&
                        <Image style={{
                            width: 300,
                            height: 300,
                            resizeMode: Image.resizeMode.contain,
                        }} source={{uri: this.state.image.qrcode}}/>
                        }
                    </View>
                </View>
                {isRealized && <View style={{position: 'absolute', left: 15, top: 350, backgroundColor: 'transparent'}}>
                    <Text style={{
                        backgroundColor: 'white',
                        fontSize: 70,
                        fontWeight: 'bold',
                        transform: [{rotate: '45deg'}],
                        color: '#2db6c8'
                    }}>{strings.Realized.toUpperCase()}</Text>
                </View>}
            </ScrollView>

        );
    }
}

export default connect(
    state => ({
        update: state.myPromotions.update,
        myPromotions: state.myPromotions.feeds,
    })
)(RealizePromotion);
