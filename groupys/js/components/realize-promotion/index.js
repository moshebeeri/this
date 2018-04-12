import React, {Component} from 'react';
import {Button, Card, CardItem, Container, Content, Footer, Icon, Input, Item, List, ListItem} from 'native-base';
import {BackHandler, Dimensions, Image, ScrollView, View} from 'react-native';
import PromotionApi from '../../api/promotion'
import {BusinessHeader, PromotionColumnHeader, PromotionSeperator, ThisText} from '../../ui/index';
import strings from "../../i18n/i18n"
import {connect} from 'react-redux';
import InstanceLifeCycle from '../../utils/InstanceLifeCycle'
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
        const id = this.getSavedId();
        let qrCode = await promotionApi.getPromotionQrcode(id);
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));
        this.setState({
            image: qrCode
        })
    }

    handleBack() {
    }

    componentWillUnmount() {
    }

    async realize() {
        this.props.navigation.goBack();
    }

    createItem(feed) {
        let instanceLifeCycle = new InstanceLifeCycle(this.props.myPromotions);
        let savedinstance = feed;
        if (feed.savedInstance) {
            savedinstance = feed.savedInstance;
        }
        return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id, instanceLifeCycle);
    }

    getSavedId() {
        const {feedToSavedFeed} = this.props;
        let id = this.props.navigation.state.params.item.id;
        if (this.props.navigation.state.params.id) {
            id = this.props.navigation.state.params.id;
        }
        if (feedToSavedFeed[id]) {
            id = feedToSavedFeed[id];
        }
        return id;
    }

    render() {
        const {myPromotions} = this.props;
        const id = this.getSavedId();
        let item = this.props.navigation.state.params.item;
        let isRealized = false;
        if (myPromotions[id]) {
            item = this.createItem(myPromotions[id]);
            isRealized = item.isRealized;
        }
        return (
            <ScrollView>
                <BusinessHeader backAction={this.handleBack.bind(this)} showBack navigation={this.props.navigation}
                                business={item.business}
                                categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                businessName={item.businessName}/>

                <View style={{flex: 1, backgroundColor:'white',justifyContent: 'center', alignItems: 'center'}}>



                    <PromotionColumnHeader item={item} columnStyle type={item.promotion} feed={true}
                                           titleText={item.promotionTitle}
                                           titleValue={item.promotionValue} term={item.promotionTerm}/>


                    <View style={{marginTop:5,flex: 0.2, width: StyleUtils.getWidth() - 30, height: 20,}}>

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
                    {isRealized && <View style={{transform: [{rotate: '45deg'}],position: 'absolute', left:40, top: 370, backgroundColor: 'transparent'}}>
                        <ThisText style={{
                            backgroundColor: 'white',
                            fontSize: 50,
                            marginRight:70,
                            marginTop: 30,

                            fontWeight: 'bold',

                            color: '#2db6c8'
                        }}>{strings.Realized.toUpperCase()}</ThisText>
                    </View>}

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
)(RealizePromotion);
