import React, {Component} from 'react';
import {Image, Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Tab,
    TabHeading,
    Tabs,
    Thumbnail,
    Title,
} from 'native-base';
import styles from './styles'
import {BusinessHeader, FormHeader, ImageController} from '../../../ui/index';
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";
import ThisText from "../../../ui/ThisText/ThisText";
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

class BusinessProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            codeStyle: {width: 80, height: 80, alignItems: 'center', justifyContent: 'center'},
            codeContainerStyle: {
                backgroundColor: 'white',
                position: 'absolute',
                top: 30,
                right: 20,

                alignItems: 'center',
                justifyContent: 'center'
            },
            codeTextStyle: {padding:4,fontSize: 14, marginTop: 5},
            codeFullSize: false,
        }
    }

    componentWillMount() {
        const {businesses} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        if (business && !business.qrcodeSource) {
            this.props.setBusinessQrCode(business)
        }
    }

    createBusinessLogo(selectedBusiness) {
        if (selectedBusiness && selectedBusiness.logo) {
            return <ImageController thumbnail size={50} square source={{uri: selectedBusiness.logo}}/>
        }
        if (selectedBusiness && selectedBusiness.businessLogo) {
            return <ImageController thumbnail size={50} square source={{uri: selectedBusiness.businessLogo}}/>
        }
        return <ImageController thumbnail size={50} source={require('../../../../images/client_1.png')}/>
    }

    changeQrLook() {
        if (this.state.codeFullSize) {
            this.setState({
                codeStyle: {width: 80, height: 80, alignItems: 'center', justifyContent: 'center'},
                codeTextStyle: {padding:4,fontSize: 14, marginTop: 5},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 30,
                    right: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeFullSize: false,
            })
        } else {
            this.setState({
                codeStyle: {width: StyleUtils.scale(160), height: StyleUtils.scale(160), alignItems: 'center', justifyContent: 'center'},
                codeTextStyle: {padding:4,fontSize: 14, marginTop: 5,},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 0,
                    right: 70,
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeFullSize: true,
            })
        }
    }

    loadWebSite() {
        let business = this.getBusiness();
        if (business.website) {
            Linking.openURL(business.website);
        }
    }

    sendEmail() {
        let business = this.getBusiness();
        if (business.email) {
            Linking.openURL('mailto:' + business.email);
        }
    }

    showAddress() {
        let business = this.getBusiness();
        let address = business.country + ' ' + business.city + ' ' + business.address
        let encodeAddress = encodeURI(address);
        Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeAddress);
    }

    getBusiness() {
        const {businesses} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        return business;
    }

    render() {
        const {lastBusinessQrCode} = this.props
        let business = this.getBusiness();
        let businessView = this.props.navigation.state.params.fromBusiness;
        let address = business.city + ' ' + business.address
        const banner = this.createBannerTag(business, businessView);
        return ( <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{flex: 1, backgroundColor: 'white'}}>

                    <FormHeader showBack navigation={this.props.navigation}
                                title={strings.Business} bgc="#2db6c8"/>

                    <View style={{marginTop: 1,backgroundColor: '#eaeaea'}}>
                        <View style={{
                            flex: -1,
                            backgroundColor: 'white',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <View style={{alignItems: 'center'}}>
                                {banner}

                                {business.qrcodeSource &&
                                <TouchableOpacity onPress={() => this.changeQrLook()}
                                                  style={this.state.codeContainerStyle}>

                                    <Image
                                        style={this.state.codeStyle} resizeMode="cover"
                                        source={{uri: business.qrcodeSource}}>

                                    </Image>
                                    <ThisText style={this.state.codeTextStyle}>{strings.ScanToFollow}</ThisText>
                                </TouchableOpacity>
                                }
                                {lastBusinessQrCode && !business.qrcodeSource &&
                                <TouchableOpacity onPress={() => this.changeQrLook()}
                                                  style={this.state.codeContainerStyle}>

                                    <Image
                                        style={this.state.codeStyle} resizeMode="cover"
                                        source={{uri: lastBusinessQrCode}}>

                                    </Image>
                                    <ThisText style={{
                                        fontSize: 20,

                                    }}>{strings.ScanToFollow}</ThisText>
                                </TouchableOpacity>
                                }
                            </View>


                        </View>


                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>

                        {business.website &&  <TouchableOpacity onPress={() => this.loadWebSite()}
                                          style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <MaterialCommunityIcons size={StyleUtils.scale(20)} name={"web"}/>
                            <ThisText note style={{
                                fontSize: 20,
                                color: '#A9A9A9',
                                marginLeft: 15
                            }}>{business.website}</ThisText>

                        </TouchableOpacity>}
                        <TouchableOpacity onPress={() => this.sendEmail()}
                                          style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <MaterialCommunityIcons size={StyleUtils.scale(20)} name={"email-outline"}/>
                            <ThisText note style={{
                                fontSize: 20,
                                color: '#A9A9A9',
                                marginLeft: 15
                            }}>{business.email}</ThisText>

                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => this.showAddress()}
                                          style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <MaterialCommunityIcons size={StyleUtils.scale(20)} name={"map-marker"}/>
                            <ThisText note style={{fontSize: 20, color: '#A9A9A9', marginLeft: 15}}>{address}</ThisText>

                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    createBannerTag(business, businessView) {
        if (business.pictures) {
            return <View style={{}}><ImageController
                style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]}

                resizeMode="cover"
                source={{uri: business.pictures[0].pictures[0]}}>

            </ImageController>
                <LinearGradient start={{x: 1, y: 1}} end={{x: 1, y: 0}}
                                locations={[0, 0.8]}
                                colors={['#00000099', 'transparent']} style={{
                    height: StyleUtils.relativeHeight(15, 10),
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    bottom:0,
                    backgroundColor: 'transparent',
                    width: StyleUtils.getWidth()
                }}>
                    {business &&
                    <BusinessHeader noProfile navigation={this.props.navigation} business={business}
                                    categoryTitle={business.categoryTitle} businessLogo={business.logo}
                                    businessView={businessView} businessName={business.name} noMargin
                                    bgColor={'transparent'}
                                    textColor={'white'}


                    />}
                </LinearGradient>

            </View>
        }
        if (business.banner) {
            return <View style={{}}><ImageController
                style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]}
                resizeMode="cover"
                source={business.banner}>

            </ImageController>

            </View>
        }
        return <ImageController
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </ImageController>
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'businessProfile') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        businesses: state.businesses.businesses,
        currentScreen: state.render.currentScreen,
        lastBusinessQrCode: state.businesses.lastBusinessQrCode
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(BusinessProfile);