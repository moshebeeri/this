import React, {Component} from 'react';
import {Dimensions, Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View} from 'react-native';
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
    Text,
    Thumbnail,
    Title,
} from 'native-base';
import styles from './styles'
import {BusinessHeader, FormHeader, SubmitButton, TextInput,ImageController,ThisText} from '../../../ui/index';
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"
import StyleUtils from '../../../utils/styleUtils'

class BusinessAccount extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            codeStyle: {width: 80, height: 80},
            codeContainerStyle: {position: 'absolute', top: 150, right: 20},
            codeFullSize: false,
            amount: ''
        }
    }

    async chargeAccount() {
        if (this.validateForm()) {
            try {
                this.props.doPaymentTransaction(this.state.amount);
                this.setState({
                    amount: ''
                })
            } catch (error) {
                console.log('failed ' + error)
            }
        }
    }

    componentWillMount() {
        const {businesses} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id].business;
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        this.props.resetPaymentForm();
        this.props.checkFreeTier(business);
        if (business && !business.qrcodeSource) {
            this.props.setBusinessQrCode(business)
        }
    }

    validateForm() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    render() {
        const {businesses, paymentMessage} = this.props
        let business = businesses[this.props.navigation.state.params.businesses._id].business;
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        let freeTierPoints = '0';
        let points = '0';
        if (business.pricing) {
            freeTierPoints = business.pricing.freeTierPoints;
            if (business.pricing.purchasedPoints) {
                points = business.pricing.purchasedPoints;
            }
        }
        let message = undefined;
        if (paymentMessage) {
            message = <View style={{marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                <ThisText>{paymentMessage}</ThisText>
            </View>
        }
        return ( <KeyboardAvoidingView>

                <FormHeader showBack navigation={this.props.navigation}
                            title={strings.Business} bgc="#FA8559"/>
                <BusinessHeader hideMenu noProfile navigation={this.props.navigation} business={business}
                                categoryTitle={business.categoryTitle} businessLogo={business.logo}
                                businessName={business.name} noMargin
                />

                <ScrollView keyboardShouldPersistTaps={true} >
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{marginTop: 10}}>
                            <ThisText>{strings.AccountBalance}</ThisText>
                        </View>
                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                            <TextInput field={strings.FreeTierPoints} disabled value={freeTierPoints}

                            />

                        </View>
                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <TextInput field={strings.CreditPoints} disabled value={points}

                            />

                        </View>

                        <View style={[styles.inputFullTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                            <TextInput ref="2" keyboardType={'numeric'} isMandatory placeholder={strings.PayPlaceholder}
                                       field={strings.PayAmount} value={this.state.amount}
                                       onChangeText={(amount) => this.setState({amount})}

                            />

                        </View>
                        <View style={{marginTop: 20}}>
                            <SubmitButton color='#FA8559' title={strings.AddCreditPoints}
                                          onPress={this.chargeAccount.bind(this)}/>
                        </View>

                        {message}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    createBannerTag(business) {
        if (business.pictures) {
            return <View style={{}}><ImageController style={styles.bannerImageContainer} resizeMode="cover"
                                           source={{uri: business.pictures[0].pictures[0]}}>

            </ImageController>

            </View>
        }
        if (business.banner) {
            return <View style={{}}><ImageController style={styles.bannerImageContainer} resizeMode="cover"
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
        if (this.props.currentScreen === 'businessAccount') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        businesses: state.businesses.myBusinesses,
        paymentMessage: state.businesses.paymentMessage,
        currentScreen: state.render.currentScreen,
        network: state.network,
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(BusinessAccount);