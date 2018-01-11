import React, {Component} from 'react';
import {Image, Platform, View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Fab,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Thumbnail
} from 'native-base';
import styles from './styles'
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import * as userAction from "../../actions/user";
import {FormHeader, ImagePicker, Spinner, TextInput} from '../../ui/index';
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";

const noPic = require('../../../images/client_1.png');

class UserProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone_number: '',
            email: '',
            image: '',
            path: '',
            token: ''
        }
    }

    async componentWillMount() {
        if (this.props.user.user && this.props.user.user.pictures && this.props.user.user.pictures.length > 0) {
            this.setState({
                path: this.props.user.user.pictures[this.props.user.user.pictures.length - 1].pictures[0],
            })
        }
        this.setState({
            name: this.props.user.user.name,
            phone_number: this.props.user.user.phone_number,
        })
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

    save() {
        if (this.props.saving) {
            return;
        }
        if (this.validateForm()) {
            let user = {
                name: this.state.name,
                _id: this.props.user.user._id,
                image: this.state.image,
                phone_number: this.state.phone_number
            }
            this.props.updateUser(user, this.props.navigation)
        }
    }

    setImage(image) {
        this.setState({image: image});
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    render() {
        let source = noPic;
        if (this.state.path) {
            source = {
                uri: this.state.path
            }
        }
        if (this.state.image) {
            source = {
                uri: this.state.image.path
            }
        }
        let borderRaduis = 70;
        if ((Platform.OS === 'ios')) {
            borderRaduis = 48;
        }
        const image = <Image style={{
            alignSelf: 'center',
            height: 100,
            width: 100,
            borderRadius: borderRaduis,
        }} resizeMode="cover" source={source}>
        </Image>
        return (

            <View style={[styles.settingsContainer, {width: StyleUtils.getWidth()}]}>

                <FormHeader showBack submitForm={this.save.bind(this)} navigation={this.props.navigation}
                            title={strings.UserSettings} bgc="#2db6c8"/>

                <View style={[styles.thumbnail, {width: StyleUtils.getWidth()}]}>


                    <ImagePicker imageWidth={3000} imageHeight={3000} image={image}
                                 setImage={this.setImage.bind(this)}/>

                </View>
                <View>

                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                        <TextInput field={strings.UserName} value={this.state.name}
                                   returnKeyType='done' ref="1" refNext="1"

                                   onChangeText={(name) => this.setState({name})}/>
                    </View>
                    <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                        <TextInput field={strings.UserPhone} value={this.state.phone_number} disabled
                                   returnKeyType='done' ref="2" refNext="2"
                                   onChangeText={(phone_number) => this.setState({phone_number})}/>
                    </View>
                    {this.props.saving && <Spinner/>}
                </View>
            </View>

        );
    }
}

export default connect(
    state => ({
        user: state.user,
        saving: state.user.saving
    }),
    dispatch => bindActionCreators(userAction, dispatch)
)(UserProfile);


