import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Button, Container, Content, Input, InputGroup, Item, Text, View} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import EntityUtils from "../../utils/createEntity";
import Icon from 'react-native-vector-icons/Ionicons';
import * as userAction from "../../actions/user";

const logo = require('../../../images/logo.png');
const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');
const briefcase = require('../../../images/briefcase.png');
const qrcode = require('../../../images/qr-code.png');
const settings = require('../../../images/settings-work-tool.png');
const changePassword = require('../../../images/change-password-img.png');
let entityUtils = new EntityUtils();

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
        const user = this.props.user
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
            }
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

    render() {
        let source = noPic;
        if (this.props.user) {
            if (this.props.user.pictures && this.props.user.pictures.length > 0) {
                source = {
                    uri: this.props.user.pictures[this.props.user.pictures.length - 1].pictures[3]
                }
            }
        }
        return (
            <Container>
                <Content style={{backgroundColor: '#fff'}}>

                    <View style={{height: 48,flex: 1,justifyContent: 'flex-end',flexDirection: 'row'}}>
                        <Button transparent style={{}} onPress={() => this.props.closeDrawer()}>
                            <Icon active color={"#FF9046"} size={20} name="ios-arrow-back"/>

                        </Button>
                    </View>
                    <View style={styles.image}>
                        <View style={{width: 180, marginLeft: 20, marginTop: 40, alignItems: 'flex-start'}}>
                            <Text numberOfLines={2} style={{
                                color: '#fff',
                                fontStyle: 'normal',
                                fontSize: 35,
                            }}>{this.props.user.name}</Text>
                            <Text numberOfLines={2} style={{
                                color: '#fff',
                                fontStyle: 'normal',
                                fontSize: 18,
                            }}>+972 {this.props.user.phone_number}</Text>
                        </View>
                        <TouchableOpacity style={styles.thumbnail} onPress={() => this.pickPicture()}>

                            <Image style={styles.thumbnail_image} source={source}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{

                        flexDirection: 'row',
                        justifyContent: 'space-between',

                    }}>

                        <TouchableOpacity onPress={() => this.showBusinesses()}
                                          style={{marginLeft:10,marginTop: 10, flexDirection: 'column', alignItems: 'center',}} regular>
                            <Image style={{tintColor: '#FF9046', width: 30, height: 30}} source={briefcase}/>
                            <Text
                                style={{
                                    padding: 20,
                                    color: '#FF9046',
                                    fontStyle: 'normal',
                                    fontSize: 16
                                }}>Businees </Text>


                        </TouchableOpacity>
                        <View style={{marginLeft:11,width:1 ,backgroundColor:'#E0E0E0'}}></View>
                        <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                          style={{

                                              flex: 1,
                                              marginTop: 10,
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                          }}
                                          regular>
                            <Image style={{tintColor: '#FF9046', width: 30, height: 30}} source={qrcode}/>

                            <Text style={{padding: 20, color: '#FF9046', fontStyle: 'normal', fontSize: 15}}>Scan
                                Promotion</Text>


                        </TouchableOpacity>
                    </View>
                    <View style={{   borderColor:'#E0E0E0',borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between',}}>

                        <TouchableOpacity onPress={() => this.showUserProfile()}
                                          style={{marginLeft:10,marginTop: 10, flexDirection: 'column', alignItems: 'center',}} regular>
                            <Image style={{tintColor: '#FF9046', width: 30, height: 30}}
                                   source={settings}/>

                            <Text
                                style={{
                                    padding: 20,
                                    color: '#FF9046',
                                    fontStyle: 'normal',
                                    fontSize: 16
                                }}>Settings </Text>

                        </TouchableOpacity>
                        <View style={{marginLeft:15,width:1 ,backgroundColor:'#E0E0E0'}}></View>
                        <TouchableOpacity onPress={() => this.changePassword()}
                                          style={{marginTop: 10, flexDirection: 'column', alignItems: 'center',}} regular>
                            <Image style={{tintColor: '#FF9046', width: 30, height: 30}}
                                   source={changePassword}/>

                            <Text style={{padding: 20, color: '#FF9046', fontStyle: 'normal', fontSize: 16}}>Change
                                Password </Text>

                        </TouchableOpacity>
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
