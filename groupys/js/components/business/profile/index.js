import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, TouchableOpacity, View} from 'react-native';
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
import {BusinessHeader, FormHeader, TextInput} from '../../../ui/index';
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

class BusinessProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            codeStyle: {width: 80, height: 80},
            codeContainerStyle: {position: 'absolute', top: 150, right: 20},
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
            return <Thumbnail medium square source={{uri: selectedBusiness.logo}}/>
        }
        if (selectedBusiness && selectedBusiness.businessLogo) {
            return <Thumbnail medium square source={{uri: selectedBusiness.businessLogo}}/>
        }
        return <Thumbnail source={require('../../../../images/client_1.png')}/>
    }

    changeQrLook() {
        if (this.state.codeFullSize) {
            this.setState({
                codeStyle: {width: 80, height: 80},
                codeContainerStyle: {position: 'absolute', top: 150, right: 20},
                codeFullSize: false,
            })
        } else {
            this.setState({
                codeStyle: {width: 250, height: 250},
                codeContainerStyle: {position: 'absolute', top: 0, right: 70},
                codeFullSize: true,
            })
        }
    }

    render() {
        const {businesses} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        let address = business.city + ' ' + business.address
        const banner = this.createBannerTag(business);
        return ( <ScrollView>
                <View>

                    <FormHeader showBack navigation={this.props.navigation}
                                title={strings.Business} bgc="#2db6c8"/>
                    <BusinessHeader noProfile navigation={this.props.navigation} business={business}
                                    categoryTitle={business.categoryTitle} businessLogo={business.logo}
                                    businessName={business.name} noMargin
                    />
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
                                                  style={this.state.codeContainerStyle}><Image
                                    style={this.state.codeStyle} resizeMode="cover"
                                    source={{uri: business.qrcodeSource}}>

                                </Image>
                                </TouchableOpacity>
                                }
                            </View>


                        </View>


                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>

                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <TextInput placeholder={'No Website'} field={strings.Website} value={business.website}
                                       disabled


                            />
                        </View>
                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <TextInput placeholder={'No Email'} field={strings.Email} value={business.email} disabled

                            />
                        </View>


                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <TextInput field={strings.Address} value={address} disabled

                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    createBannerTag(business) {
        if (business.pictures) {
            return <View style={{}}><Image
                style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]}

                resizeMode="cover"
                source={{uri: business.pictures[0].pictures[0]}}>

            </Image>

            </View>
        }
        if (business.banner) {
            return <View style={{}}><Image
                style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]}
                resizeMode="cover"
                source={business.banner}>

            </Image>

            </View>
        }
        return <Image
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </Image>
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
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(BusinessProfile);