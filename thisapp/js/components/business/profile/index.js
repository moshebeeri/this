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
import GenericListManager from '../../generic-list-manager'

const noPic = require('../../../../images/client_1.png');

class BusinessProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            codeStyle: {
                marginBottom: -10,
                width: StyleUtils.scale(80),
                height: StyleUtils.scale(80),
                alignItems: 'center',
                justifyContent: 'center'
            },
            codeTextStyle: {padding: 4, fontSize: 12, marginTop: 0},
            codeContainerStyle: {
                backgroundColor: 'white',
                position: 'absolute',
                top: 30,
                right: 20,
                width: StyleUtils.scale(110), height: StyleUtils.scale(110),
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: 'gray',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.2,
                shadowRadius: 5,
                borderWidth: 2,
                borderRadius: 10,
                elevation: 10,
            },
            codeFullSize: false,
        }
    }

    componentWillMount() {
        let business = this.getBusiness();
        if (business && !business.qrcodeSource) {
            this.props.setBusinessQrCode(business)
        }
        this.props.getBusinessTopFollowers(business._id);
    }

    getBusiness() {
        const {businesses} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        return business
    }

    nextBusinessFollowers() {
        const business = this.getBusiness();
        if (business) {
            this.props.getNextBusinessFollowers(business._id);
        }
    }

    renderFollowerItem(item) {
        let source = noPic;
        if (item.item.pictures && item.item.pictures.length > 0) {
            source = {
                uri: item.item.pictures[item.item.pictures.length - 1].pictures[3]
            }
        } else {
            if (item.item.entity) {
                source = {
                    uri: item.item.entity.business.logo
                }
            }
        }
        return <View style={{
            flex: 1,
            width: StyleUtils.getWidth() - 10,
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            height: StyleUtils.scale(70)
        }}>
            <View style={{marginLeft:5,marginRight:5}}>
            <ImageController thumbnail size={StyleUtils.scale(50)} source={source}/>
            </View>
            <ThisText style={{marginLeft: 10, marginRight: 10}}>{item.item.name}</ThisText>

        </View>
    }

    changeQrLook() {
        if (this.state.codeFullSize) {
            this.setState({
                codeStyle: {
                    marginBottom: -10,
                    width: StyleUtils.scale(80),
                    height: StyleUtils.scale(80),
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeTextStyle: {padding: 4, fontSize: 12, marginTop: 0},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 30,
                    right: 20,
                    width: StyleUtils.scale(110), height: StyleUtils.scale(110),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'gray',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderWidth: 2,
                    borderRadius: 10,
                    elevation: 10,
                },
                codeFullSize: false,
            })
        } else {
            this.setState({
                codeStyle: {
                    marginBottom: -10,
                    width: StyleUtils.scale(150),
                    height: StyleUtils.scale(150),
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                codeTextStyle: {padding: 4, fontSize: 14, marginTop: 0,},
                codeContainerStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: (StyleUtils.relativeHeight(30, 30) - StyleUtils.scale(170)) / 2,
                    right: (StyleUtils.getWidth() - StyleUtils.scale(170)) / 2,
                    width: StyleUtils.scale(170), height: StyleUtils.scale(170),
                    borderColor: 'gray',
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderRadius: 10,
                    elevation: 10,
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
        const {lastBusinessQrCode, allBusinessFollowers} = this.props
        let business = this.getBusiness();
        let businessView = this.props.navigation.state.params.fromBusiness;
        let address = business.city + ' ' + business.address
        const banner = this.createBannerTag(business, businessView);
        let qrCodeString = this.state.codeFullSize ? strings.ScanToFollow : strings.clickToEnlarge;
        return ( <View style={{flex: 1, backgroundColor: '#eaeaea'}}>
                <FormHeader showBack navigation={this.props.navigation}
                            title={strings.Business} bgc="#2db6c8"/>
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View style={{flex: 1, backgroundColor: 'white'}}>


                        <View style={{marginTop: 1, backgroundColor: '#eaeaea'}}>
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
                                        <ThisText style={this.state.codeTextStyle}>{qrCodeString}</ThisText>
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
                                        }}>{qrCodeString}</ThisText>
                                    </TouchableOpacity>
                                    }
                                </View>


                            </View>


                        </View>
                        <View
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>

                            {business.website && <TouchableOpacity onPress={() => this.loadWebSite()}
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
                                <ThisText note
                                          style={{fontSize: 20, color: '#A9A9A9', marginLeft: 15}}>{address}</ThisText>

                            </TouchableOpacity>
                        </View>
                    </View>
                    {allBusinessFollowers[business._id] && <View style={styles.inputFullTextLayout}>
                        <ThisText
                            style={{
                                marginLeft: 10,
                                fontSize: 14,
                                color: '#A9A9A9'
                            }}>{strings.BusinessFollowers}</ThisText>
                    </View>}
                    {allBusinessFollowers[business._id] && allBusinessFollowers[business._id].length > 0 &&
                    <GenericListManager rows={allBusinessFollowers[business._id]}
                                        onEndReached={this.nextBusinessFollowers.bind(this)}
                                        ItemDetail={this.renderFollowerItem.bind(this)}/>
                    }
                </ScrollView>
            </View>
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
                    bottom: 0,
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
        allBusinessFollowers: state.businesses.allBusinessFollowers,
        currentScreen: state.render.currentScreen,
        lastBusinessQrCode: state.businesses.lastBusinessQrCode
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(BusinessProfile);