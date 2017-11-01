import React, {Component} from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Button, Container, Content, Input, InputGroup, Item, Text, View} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import EntityUtils from "../../utils/createEntity";
import * as userAction from "../../actions/user";
import StyleUtils from "../../utils/styleUtils";
import {CloseDrawer,Video} from "../../ui/index";
const logo = require('../../../images/logo.png');
const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');
const briefcase = require('../../../images/briefcase.png');
const qrcode = require('../../../images/qr-code.png');
const settings = require('../../../images/settings-work-tool.png');
const changePassword = require('../../../images/change-password-img.png');
let entityUtils = new EntityUtils();
import Icon from 'react-native-vector-icons/FontAwesome';

import strings from "../../i18n/i18n"

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

    showPromotions() {
        this.replaceRoute('home');
    }

    async pickPicture() {
        try {
            let image = await ImagePicker.openPicker({
                cropping: true,
                width: 2000,
                height: 2000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            let user = {
                name: this.props.user.name,
                _id: this.props.user._id,
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                phone_number: this.props.user.phone_number,
            };
            entityUtils.update('users', user, this.props.token, this.formSuccess.bind(this), this.formFailed.bind(this), '');
        } catch (e) {
            console.log(e);
        }
    }

    formSuccess() {
        this.props.actions.fetchUsers();
    }

    formFailed() {
    }

    // let styles = StyleSheet.create({
    //     backgroundVideo: {
    //         position: 'absolute',
    //         top: 0,
    //         left: 0,
    //         bottom: 0,
    //         right: 0,
    //     },
    // });

    render() {
        let source = noPic;
        if (this.props.user) {
            if (this.props.user.pictures && this.props.user.pictures.length > 0) {
                source = {
                    uri: this.props.user.pictures[this.props.user.pictures.length - 1].pictures[3]
                }
            }
        }
        let name = StyleUtils.toTitleCase(this.props.user? this.props.user.name : 'name');
        let phoneNumber = StyleUtils.parseUserPhoneNumber(this.props.user);
        return (
            <Container>
                <Content style={{backgroundColor: '#F2F2F2'}}>
                    {/*Header style*/}
                    <View style={{width:500,height:400,backgroundColor:'blue'}}>
                        <Video
                            rate={1} volume={1} muted={true}
                            resizeMode="cover" repeat={true} key="video1"
                            paused={false}
                            style={styles.backgroundVideo}
                            /*source={require('../../../images/ArchitectVideo.mp4')}*/
                            source={{uri:'https://archive.org/download/VideoSample-Video3/ArchitectVideo_512kb.mp4'}}
                        />
                    </View>
                    <View style={{height: 55, flex: 1, justifyContent: 'flex-end',flexDirection: 'row'}}>
                        <CloseDrawer active color={"#FF9046"} size={20} onPress={() => this.props.closeDrawer()}/>
                    </View>
                    {/*form header*/}
                    <View style={styles.image}>
                        <View style={{width:185, marginLeft: 20, marginTop: 0, alignItems: 'flex-start', backgroundColor: '#FF9046'}}>
                            <Text numberOfLines={2} style={{
                                color: '#fff',
                                lineHeight:32,
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
                        <TouchableOpacity style={styles.thumbnail} onPress={() => this.pickPicture()}>

                            <Image style={styles.thumbnail_image} source={source}/>
                        </TouchableOpacity>
                    </View>
                    {/*button grid*/}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 100
                    }}>
                        <View style={{flex:1, flexDirection: 'row', borderRightWidth:1, borderColor: '#E5E5E5'}}>
                            <TouchableOpacity onPress={() => this.showBusinesses()}
                                              style={{flex:1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Image style={{tintColor: '#FF9046', marginTop: 21, width: 30, height: 30}} source={briefcase}/>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: '#FF9046',
                                        fontStyle: 'normal',
                                        fontSize: 16
                                    }}>{strings.businesses}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                              style={{
                                                  flex: 1,
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                              }}
                                              regular>
                                <Image style={{tintColor: '#FF9046', marginTop: 21, width: 30, height: 30}} source={qrcode}/>
                                <Text style={{marginTop: 10, color: '#FF9046', fontStyle: 'normal', fontSize: 15
                                }}>{strings.scanPromotion}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 100,
                        borderWidth:1,
                        borderColor: '#E5E5E5'
                    }}>
                        <View style={{flex:1, flexDirection: 'row', borderRightWidth:1, borderColor: '#E5E5E5'}}>
                            <TouchableOpacity onPress={() => this.showUserProfile()}
                                              style={{flex:1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Image style={{tintColor: '#FF9046', marginTop: 21, width: 30, height: 30}}
                                       source={settings}/>

                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: '#FF9046',
                                        fontStyle: 'normal',
                                        fontSize: 16
                                    }}>{strings.settings}</Text>

                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.changePassword()}
                                              style={{flex:1, flexDirection: 'column', alignItems: 'center'}} regular>
                                <Icon style={{marginTop: 21, marginBottom:-6}} color="#FF9046" size={36} name="lock"/>
                                <Text style={{
                                    marginTop: 10,
                                    color: '#FF9046',
                                    fontStyle: 'normal',
                                    fontSize: 16
                                }}>{strings.changePassword} </Text>

                            </TouchableOpacity>
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
