import React, {Component} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity,I18nManager} from 'react-native';
import {Button, Container, Content, Input, InputGroup, Item, Text, View} from 'native-base';
import styles from './styles';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as userAction from "../../actions/user";
import StyleUtils from "../../utils/styleUtils";
import Icon from 'react-native-vector-icons/FontAwesome';
import {CloseDrawer, ImagePicker} from "../../ui/index";
import strings from "../../i18n/i18n"

const noPic = require('../../../images/client_1.png');
const briefcase = require('../../../images/briefcase.png');
const settings = require('../../../images/settings-work-tool.png');

// import pageSync from "../../refresh/refresher"
//
// pageSync.check();

class ProfileDrawer extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: ''
        };
    }

    async componentWillMount() {
        const user = this.props.user;
        if (user) {
            this.setState({
                phoneNumber: user.country_code + '-' + user.phone_number
            });
        }
    }

    setImage(image) {
        const {actions, user} = this.props;
        let updatedUser = user;
        updatedUser.image = image;
        this.setState({image: image});
        actions.updateUser(updatedUser, undefined);
    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    showPromotionScaning() {
        this.replaceRoute('ReadQrCode');
    }

    showUserProfile() {
        this.replaceRoute('UserProfile');
    }

    changePassword() {
        this.replaceRoute('changePassword');
    }

    showBusinesses() {
        this.replaceRoute('businesses');
    }

    render() {
        let source = noPic;
        if (this.props.user) {
            if (this.props.user.pictures && this.props.user.pictures.length > 0) {
                source = {
                    uri: this.props.user.pictures[this.props.user.pictures.length - 1].pictures[3]
                }
            }
        }
        if (this.state.image) {
            source = {
                uri: this.state.image.path
            }
        }
        let name = StyleUtils.toTitleCase(this.props.user ? this.props.user.name : 'name');
        let phoneNumber = StyleUtils.parseUserPhoneNumber(this.props.user);
        let borderRadiusSize = 40;
        if (Platform.OS === 'ios') {
            borderRadiusSize = 35;
        }
        let userImage = <Image style={{width: 80, height: 80, borderRadius: borderRadiusSize,}} source={source}/>;
        return (
            <Container>
                <Content style={{backgroundColor: '#F2F2F2'}}>

                    <View style={{height: 55, flex: 1, justifyContent: I18nManager.isRTL ? 'flex-end': 'flex-start', flexDirection: 'row'}}>
                        <CloseDrawer active color={"#FF9046"} size={30} onPress={() => this.props.closeDrawer()}/>
                    </View>
                    {/*form header*/}
                    <View style={styles.image}>
                        <View style={{
                            width: 185,
                            marginLeft: 20,
                            marginTop: 0,
                            alignItems: 'flex-start',
                            backgroundColor: '#FF9046'
                        }}>
                            <Text numberOfLines={2} style={{
                                color: '#fff',
                                lineHeight: 32,
                                width: 120,
                                fontFamily: 'Roboto-Regular',
                                marginTop: 33,
                                fontStyle: 'normal',
                                fontSize: 32,
                            }}>{name}</Text>
                            <Text numberOfLines={2} style={{
                                color: '#fff',
                                marginTop: 7,
                                fontStyle: 'normal',
                                fontSize: 16,
                            }}>{phoneNumber}</Text>


                        </View>
                        <View style={styles.thumbnail}>

                            <ImagePicker imageWidth={3000} imageHeight={3000} image={userImage}
                                         setImage={this.setImage.bind(this)}/>

                        </View>


                    </View>
                    {/*button grid*/}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 100
                    }}>
                        <View style={{flex: 1, flexDirection: 'row', borderRightWidth: 1, borderColor: '#E5E5E5'}}>
                            <TouchableOpacity onPress={() => this.showBusinesses()}
                                              style={{flex: 1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Image style={{tintColor: '#FF9046', marginTop: 21, width: 30, height: 30}}
                                       source={briefcase}/>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: '#FF9046',
                                        fontStyle: 'normal',
                                        fontSize: 16
                                    }}>{strings.Businesses}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.changePassword()}
                                              style={{flex: 1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Icon style={{marginTop: 21, marginBottom: -6}} color="#FF9046" size={36} name="lock"/>
                                <Text style={{
                                    marginTop: 10,
                                    color: '#FF9046',
                                    fontStyle: 'normal',
                                    fontSize: 16
                                }}>{strings.ChangePassword} </Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 100,
                        borderWidth: 1,
                        borderColor: '#E5E5E5'
                    }}>
                        <View style={{flex: 1, flexDirection: 'row', borderRightWidth: 1, borderColor: '#E5E5E5'}}>
                            <TouchableOpacity onPress={() => this.showUserProfile()}
                                              style={{flex: 1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Image style={{tintColor: '#FF9046', marginTop: 21, width: 30, height: 30}}
                                       source={settings}/>

                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: '#FF9046',
                                        fontStyle: 'normal',
                                        fontSize: 16
                                    }}>{strings.Settings}</Text>

                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>

                        </View>
                    </View>
                </Content>
            </Container>

        );
    }
}

export default connect(
    state => ({
        user: state.user.user,
        token: state.authentication.token
    }),
    (dispatch) => ({
        actions: bindActionCreators(userAction, dispatch),
    })
)(ProfileDrawer);
