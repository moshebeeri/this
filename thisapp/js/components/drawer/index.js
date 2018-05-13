import React, {Component} from 'react';
import {Dimensions, Image, Linking,InteractionManager, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Container, Content, Input, InputGroup, Item, View} from 'native-base';
import styles from './styles';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as userAction from "../../actions/user";
import StyleUtils from "../../utils/styleUtils";
import Icon from 'react-native-vector-icons/FontAwesome';
import {CloseDrawer, ImageController, ImagePicker, ThisText} from "../../ui/index";
import strings from "../../i18n/i18n"

const noPic = require('../../../images/client_1.png');
const briefcase = require('../../../images/briefcase.png');
const settings = require('../../../images/settings-work-tool.png');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
import navigationUtils from '../../utils/navigationUtils'
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
            InteractionManager.runAfterInteractions(() => {
            this.setState({
                phoneNumber: user.country_code + '-' + user.phone_number
            })});
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
        navigationUtils.doNavigation(this.props.navigation,route)

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

    help(){
        Linking.openURL(`${help_url}/` );
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
        let borderRadiusSize = 60;
        if (Platform.OS === 'ios') {
            borderRadiusSize = 60;
        }
        let userImage = <ImageController style={{width: StyleUtils.scale(120), height:  StyleUtils.scale(120), borderRadius: StyleUtils.scale(borderRadiusSize),}} source={source}/>;
        return (
            <ScrollView>
            <View style={{width:deviceWidth/5*4,justifyContent:'flex-start',height:deviceHeight,opacity:0.9,backgroundColor: '#41aad9'}}>

                <View style={{
                    height:  StyleUtils.scale(55),

                    alignItems: 'center',
                    opacity:1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',


                }}>
                    <TouchableOpacityFix onPress={() => this.showUserProfile()}
                                      style={{marginLeft:StyleUtils.scale(15),width:  StyleUtils.scale(40), height:  StyleUtils.scale(30),flexDirection: 'column', alignItems: 'center'}} regular>
                        <ImageController style={{tintColor: 'white', width:  StyleUtils.scale(30), height:  StyleUtils.scale(30)}}
                               source={settings}/>


                    </TouchableOpacityFix>
                    <View style={{marginRight:StyleUtils.scale(20)}}>
                    <CloseDrawer active color={'white'} size={ StyleUtils.scale(30)} onPress={() => this.props.closeDrawer()}/>
                    </View>
                </View>
                {/*form header*/}

                <View style={styles.image}>
                    <View style={styles.thumbnail}>

                        <ImagePicker name={"drawerPicker"} ref={"drawerPicker"} logo={true} image={userImage}
                                     setImage={this.setImage.bind(this)}/>

                    </View>



                </View>
                <View style={{


                    marginTop:  StyleUtils.scale(-10),

                    alignItems: 'center',
                    justifyContent:'center',
                    opacity:1,
                    height: StyleUtils.scale(70),


                }}>
                    <ThisText numberOfLines={2} style={{
                        color: '#fff',
                        lineHeight: 32,

                        fontFamily: 'Roboto-Regular',
                        marginTop: 5,
                        fontStyle: 'normal',
                        fontSize:  StyleUtils.scale(20),
                    }}>{name}</ThisText>
                    <ThisText numberOfLines={2} style={{
                        color: '#fff',
                        marginTop: 7,
                        fontStyle: 'normal',
                        fontSize:  StyleUtils.scale(16),
                    }}>{phoneNumber}</ThisText>


                </View>

                {/*button grid*/}

                    <View style={{ borderTopWidth:1,borderBottomWidth:1,marginTop:10,height:StyleUtils.scale(70),width:deviceWidth/5*4,flexDirection: 'column',  borderColor: '#E5E5E5'}}>
                        <TouchableOpacityFix onPress={() => this.showBusinesses()}
                                          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} regular>
                            <Image style={{tintColor: 'white', marginLeft: StyleUtils.scale(20), width:  StyleUtils.scale(30), height:  StyleUtils.scale(30)}}
                                   source={briefcase}/>
                            <ThisText
                                style={{

                                    color: 'white',
                                    fontStyle: 'normal',
                                    marginLeft:StyleUtils.scale(20),
                                    fontSize:  StyleUtils.scale(16)
                                }}>{strings.Businesses}</ThisText>
                        </TouchableOpacityFix>
                    </View>
                    <View style={{height: StyleUtils.scale(70),width:deviceWidth/5*4,borderBottomWidth:1,flexDirection: 'row',borderColor: '#E5E5E5'}}>
                        <TouchableOpacityFix onPress={() => this.changePassword()}
                                          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} regular>
                            <Icon style={{marginLeft: StyleUtils.scale(20), marginBottom: -6}} color="white" size={ StyleUtils.scale(36)} name="lock"/>
                            <ThisText style={{
                                marginLeft:StyleUtils.scale(22),
                                color: 'white',
                                fontStyle: 'normal',
                                fontSize:  StyleUtils.scale(16)
                            }}>{strings.ChangePassword} </ThisText>

                        </TouchableOpacityFix>
                    </View>
                <View style={{height: StyleUtils.scale(70),width:deviceWidth/5*4,borderBottomWidth:1,flexDirection: 'row',borderColor: '#E5E5E5'}}>
                    <TouchableOpacityFix onPress={() => this.help()}
                                         style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} regular>
                        <Icon style={{marginLeft: StyleUtils.scale(20), marginBottom: -6}} color="white" size={ StyleUtils.scale(36)} name="help"/>
                        <ThisText style={{
                            marginLeft:StyleUtils.scale(22),
                            color: 'white',
                            fontStyle: 'normal',
                            fontSize:  StyleUtils.scale(16)
                        }}>{strings.Help} </ThisText>

                    </TouchableOpacityFix>
                </View>
            </View>
            </ScrollView>


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
