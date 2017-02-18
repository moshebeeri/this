import React, {Component} from 'react';
import {View, Platform, ScrollView} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Header,
    Content,
    Text,
    Button,
    Icon,
    Image,
    Card,
    CardItem,
    Thumbnail,
    TouchableOpacity
} from 'native-base';
import { connect } from 'react-redux';
import navigateTo from '../../../actions/sideBarNav';
import theme from '../../../themes/base-theme';
import addTheme from './add-theme';
import styles from './style'
import {
    Form,
    Separator, InputField, LinkField,
    SwitchField, PickerField, DatePickerField, TimePickerField
} from 'react-native-form-generator';

const {
    popRoute,
} = actions;

import ImagePicker from 'react-native-image-crop-picker';

class AddBusinessForm extends Component {

    static propTypes = {
        popRoute: React.PropTypes.func,
        navigateTo: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
        }
    }

    handleFormChange(formData) {


        this.setState({formData: formData})
        this.props.onFormChange && this.props.onFormChange(formData);
    }

    handleFormFocus(e, component) {
        //console.log(e, component);
    }

    openTermsAndConditionsURL() {

    }

    popRoute() {
        this.props.popRoute(this.props.navigation.key);
    }


    addLogo() {

    }

    navigateTo(route) {
        this.props.navigateTo(route, 'addBusinessForm');
    }

    render() {
        return (
            <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
                <Content theme={addTheme} style={{ backgroundColor: addTheme.backgroundColor }}>
                    <Header style={{ justifyContent: 'flex-start', paddingTop: (Platform.OS === 'ios') ? 23 : 9 }}>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name="ios-arrow-round-back-outline"
                                  style={{ fontSize: 30, lineHeight: 32, paddingRight: 10 }}/>
                            Business
                        </Button>
                    </Header>
                    <ScrollView keyboardShouldPersistTaps={true} style={{paddingLeft:10,paddingRight:10}}>
                        <Form
                            ref='registrationForm'
                            onFocus={this.handleFormFocus.bind(this)}
                            onChange={this.handleFormChange.bind(this)}
                            label="Business Information">
                            <Separator />
                            <InputField ref='name' label='Name' placeholder='Name'/>
                            <InputField ref='mall' label='Mail' placeholder='Mail'/>
                            <InputField ref='address' label='Address' placeholder='Address'/>
                            <InputField ref='address2' label='Address2' placeholder='Address2'/>
                            <InputField ref='city' label='city' placeholder='city'/>
                            <InputField ref='country' label='country' placeholder='country'/>
                            <InputField ref='website' label='Website' placeholder='website'/>
                            <InputField ref='main_phone_number' label='Phone Number' placeholder='Phone Number'/>
                            <Separator />
                        </Form>
                    </ScrollView>
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: key => dispatch(popRoute(key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(AddBusinessForm);
