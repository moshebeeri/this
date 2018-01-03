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
import {BusinessHeader, FormHeader, SubmitButton, TextInput} from '../../../ui/index';
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"

const card = {
    number: "4111111111111111",
    expirationDate: "10/20", // or "10/2020" or any valid date
    cvv: "400",
}
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const BTClient = require('react-native-braintree-xplat');

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
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        this.props.resetPaymentForm();
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
        let business = businesses[this.props.navigation.state.params.businesses._id];
        if (!business) {
            business = this.props.navigation.state.params.businesses;
        }
        let message = undefined;
        if (paymentMessage) {
            message = <View style={{marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                <Text>{paymentMessage}</Text>
            </View>
        }
        return ( <KeyboardAvoidingView>

                <FormHeader showBack navigation={this.props.navigation}
                            title={strings.Business} bgc="#FA8559"/>
                <BusinessHeader hideMenu noProfile navigation={this.props.navigation} business={business}
                                categoryTitle={business.categoryTitle} businessLogo={business.logo}
                                businessName={business.name} noMargin
                />

                <ScrollView>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{marginTop: 10}}>
                            <Text>{strings.AccountBalance}</Text>
                        </View>

                        <View style={styles.inputFullTextLayout}>
                            <TextInput field={strings.Points} disabled value={'10,000'}

                            />

                        </View>
                        <View style={styles.inputFullTextLayout}>
                            <TextInput ref="2" keyboardType={'numeric'} isMandatory placeholder={strings.PayPlaceholder}
                                       field={strings.PayAmount} value={this.state.amount}
                                       onChangeText={(amount) => this.setState({amount})}

                            />

                        </View>
                        <View style={{marginTop: 20}}>
                            <SubmitButton color='#FA8559' title={strings.ADDPOINTS}
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
            return <View style={{}}><Image style={styles.bannerImageContainer} resizeMode="cover"
                                           source={{uri: business.pictures[0].pictures[0]}}>

            </Image>

            </View>
        }
        if (business.banner) {
            return <View style={{}}><Image style={styles.bannerImageContainer} resizeMode="cover"
                                           source={business.banner}>

            </Image>

            </View>
        }
        return <Image
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </Image>
    }
}

export default connect(
    state => ({
        businesses: state.businesses.businesses,
        paymentMessage: state.businesses.paymentMessage
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(BusinessAccount);