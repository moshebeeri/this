import React, {Component} from 'react';
import {I18nManager, Text, View} from 'react-native';
import {Icon, Input, Spinner} from 'native-base';
import styles from './styles';
import {DynamicMessage, TextInput} from '../index';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as addressAction from "../../actions/address";
import strings from "../../i18n/i18n"

class AddressInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
            city: '',
            country: strings.Israel,
            address: '',
            locations: '',
            spinner: false,
        }
        props.actions.resetForm();
    }

    focus() {
        this.refs["city"].focus()
    }

    componentWillMount() {
        const {country, city, address} = this.props;
        this.setState({
            country: country,
            city: city,
            address: address,
        })
    }

    focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    isValid() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (!item.isValid()) {
                result = false;
            }
        });
        return result;
    }

    checkAddress() {
        let address = {
            city: this.state.city,
            address: this.state.address,
            country: this.state.country,
        }
        this.props.actions.validateAddress(address);
    }

    chooseAddress(address) {
        let city = address.address_components.filter(function (component) {
            return component.types.includes("locality")
        });
        let street = address.address_components.filter(function (component) {
            return component.types.includes("route")
        });
        let street_nummber = address.address_components.filter(function (component) {
            return component.types.includes("street_number")
        });
        let address_string = street[0].long_name;
        if (street_nummber.length > 0) {
            address_string = street[0].long_name + ' ' + street_nummber[0].long_name
        }
        this.setState({
            locations: {},
            location: {
                lat: address.geometry.location.lat,
                lng: address.geometry.location.lng,
            },
            city: city[0].long_name,
            address: address_string,
            valid: true,
        })
        this.props.actions.addressChoose();
        this.setSubmut();
    }

    locationToString(location) {
        return location.formatted_address;
    }

    validateAddress() {
        if (this.state.invalid) {
            return false;
        }
        return !(this.state.locations && this.state.locations.length > 0)
    }

    onSubmit() {
        this.checkAddress();
        this.setSubmut();
    }

    setSubmut() {
        const {onSubmitEditing, addressForm} = this.props;
        let address = {
            location: addressForm.location,
            city: this.state.city,
            address: this.state.address,
            country: this.state.country,
        }
        if (onSubmitEditing) {
            onSubmitEditing(address);
        }
    }

    render() {
        const {isMandatory, addressForm, refNext} = this.props;
        return <View>
            <View style={styles.inputTextLayout}>
                <View style={{flexDirection: "row", justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end'}}>
                    {/*{!I18nManager.isRTL && isMandatory &&*/}
                    {/*<Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}*/}

                    <Text style={styles.textInputTextStyle}>{strings.LocationAddress}</Text>
                    { isMandatory &&
                    <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
                </View>
                <View>
                    <TextInput placeholder={strings.Country} value={this.state.country} returnKeyType='next'
                               ref={refNext}
                               refNext={refNext}
                               onSubmitEditing={this.focusNextField.bind(this, "city")}
                               validateContent={this.validateAddress.bind(this)}
                               onChangeText={(country) => this.setState({country})} isMandatory={isMandatory}/>


                    <TextInput placeholder={strings.City} value={this.state.city} returnKeyType='next' ref="city"
                               refNext="city"
                               onSubmitEditing={this.focusNextField.bind(this, "address")}
                               validateContent={this.validateAddress.bind(this)}
                               onChangeText={(city) => this.setState({city})} isMandatory={isMandatory}/>



                   <TextInput
                        placeholder={strings.Address} value={this.state.address} returnKeyType='next'
                        ref="address"
                        refNext="address"
                        onSubmitEditing={this.onSubmit.bind(this)}
                        validateContent={this.validateAddress.bind(this)}
                        onChangeText={(address) => this.setState({address})} isMandatory={isMandatory}/>


                </View>
            </View>
            {addressForm.validating && <Spinner/>}
            {addressForm.addressNotFound &&
            <Text style={{marginLeft: 10, color: 'red'}}>{addressForm.addressNotFoundMessage}</Text>}
            {addressForm.locations && addressForm.locations.length > 0 &&
            <DynamicMessage messagesObject={addressForm.locations} messageToString={this.locationToString.bind(this)}
                            onMessage={this.chooseAddress.bind(this)}/>}
        </View>
    }
}

export default connect(
    state => ({
        addressForm: state.addressForm
    }),
    (dispatch) => ({
        actions: bindActionCreators(addressAction, dispatch),
    }), null, {withRef: true}
)(AddressInput);
