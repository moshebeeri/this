import React, {Component} from 'react';
import {I18nManager, Text, View,Keyboard} from 'react-native';
import {Icon, Input, Spinner} from 'native-base';
import styles from './styles';
import {DynamicMessage, TextInput,ThisText} from '../index';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as addressAction from "../../actions/address";
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";

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
            ilegalAddress:false,
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

    isValid(onValid) {
        const {addressForm} = this.props;
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (!item.isValid()) {
                result = false;
            }
        });

        if(!addressForm.hasValidated){
            this.onSubmit(onValid);

            return false;
        }
        if(addressForm.addressNotFound){
            this.onSubmit(onValid);

            return false;
        }

        if(addressForm.locations && addressForm.locations> 1){

            if(!this.state.location) {
                this.onSubmit(onValid);

                return false;
            }
        }
        this.setState({ilegalAddress:false});
        return result;
    }

    checkAddress(onValid) {
        let address = {
            city: this.state.city,
            address: this.state.address,
            country: this.state.country,
        }
        this.props.actions.validateAddress(address,onValid);
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

    setValue(value){
        this.setState(value);
        this.props.actions.addressChangeed();
    }

    async onSubmit(onValid) {
        this.checkAddress(onValid);
        Keyboard.dismiss();
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
        let ilegalBorder = 0;
        if(addressForm.ilegalAddress || addressForm.addressNotFound){
            ilegalBorder = 1;
        }
        return <View>
            <View style={[styles.inputTextLayout, {borderWidth:ilegalBorder,borderColor:'red',width: StyleUtils.getWidth() - 15}]}>

                <View style={{flexDirection: "row", justifyContent: 'flex-start' }}>
                    {/*{!I18nManager.isRTL && isMandatory &&*/}
                    {/*<Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}*/}

                    <ThisText style={styles.textInputTextStyle}>{strings.LocationAddress}</ThisText>
                    { isMandatory &&
                    <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
                </View>
                <View>
                    <TextInput placeholder={strings.Country} value={this.state.country} returnKeyType='next'
                               ref={refNext}
                               refNext={refNext}
                               onSubmitEditing={this.focusNextField.bind(this, "city")}
                               validateContent={this.validateAddress.bind(this)}
                               onChangeText={(country) => this.setValue({country})} isMandatory={isMandatory}/>


                    <TextInput placeholder={strings.City} value={this.state.city} returnKeyType='next' ref="city"
                               refNext="city"
                               onSubmitEditing={this.focusNextField.bind(this, "address")}
                               validateContent={this.validateAddress.bind(this)}
                               onChangeText={(city) => this.setValue({city})} isMandatory={isMandatory}/>



                   <TextInput
                        placeholder={strings.Address} value={this.state.address} returnKeyType='next'
                        ref="address"
                        refNext="address"
                        onSubmitEditing={this.onSubmit.bind(this)}
                        validateContent={this.validateAddress.bind(this)}
                        onChangeText={(address) => this.setValue({address})} isMandatory={isMandatory}/>


                </View>
            </View>
            {addressForm.validating && <Spinner/>}
            {addressForm.addressNotFound &&
            <ThisText style={{marginLeft: 10, color: 'red'}}>{addressForm.addressNotFoundMessage}</ThisText>}
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
