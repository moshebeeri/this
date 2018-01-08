import React, {Component} from 'react';
import {I18nManager, Image, Platform, StyleSheet, TouchableOpacity,Dimensions} from 'react-native';
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
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
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
        let borderRadiusSize = 50;
        if (Platform.OS === 'ios') {
            borderRadiusSize = 50;
        }
        let userImage = <Image style={{width: 120, height: 120, borderRadius: borderRadiusSize,}} source={source}/>;
        return (

            <View style={{width:deviceWidth/5*4,justifyContent:'flex-start',height:deviceHeight,opacity:0.9,backgroundColor: '#41aad9'}}>

                <View style={{
                    height: 55,

                    alignItems: 'center',
                    opacity:1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',


                }}>
                    <TouchableOpacity onPress={() => this.showUserProfile()}
                                      style={{marginLeft:15,width: 40, height: 30,flexDirection: 'column', alignItems: 'center'}} regular>
                        <Image style={{tintColor: 'white', width: 30, height: 30}}
                               source={settings}/>


                    </TouchableOpacity>
                    <View style={{marginRight:20}}>
                    <CloseDrawer active color={'white'} size={30} onPress={() => this.props.closeDrawer()}/>
                    </View>
                </View>
                {/*form header*/}

                <View style={styles.image}>
                    <View style={styles.thumbnail}>

                        <ImagePicker imageWidth={3000} imageHeight={3000} image={userImage}
                                     setImage={this.setImage.bind(this)}/>

                    </View>



                </View>
                <View style={{


                    marginTop: -10,

                    alignItems: 'center',
                    justifyContent:'center',
                    opacity:1,
                    height:70,


                }}>
                    <Text numberOfLines={2} style={{
                        color: '#fff',
                        lineHeight: 32,

                        fontFamily: 'Roboto-Regular',
                        marginTop: 5,
                        fontStyle: 'normal',
                        fontSize: 20,
                    }}>{name}</Text>
                    <Text numberOfLines={2} style={{
                        color: '#fff',
                        marginTop: 7,
                        fontStyle: 'normal',
                        fontSize: 16,
                    }}>{phoneNumber}</Text>


                </View>

                {/*button grid*/}

                    <View style={{ borderTopWidth:1,borderBottomWidth:1,marginTop:10,height:70,width:deviceWidth/5*4,flexDirection: 'column',  borderColor: '#E5E5E5'}}>
                        <TouchableOpacity onPress={() => this.showBusinesses()}
                                          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} regular>
                            <Image style={{tintColor: 'white', marginLeft: 20, width: 30, height: 30}}
                                   source={briefcase}/>
                            <Text
                                style={{

                                    color: 'white',
                                    fontStyle: 'normal',
                                    marginLeft:20,
                                    fontSize: 16
                                }}>{strings.Businesses}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:70,width:deviceWidth/5*4,borderBottomWidth:1,flexDirection: 'row',borderColor: '#E5E5E5'}}>
                        <TouchableOpacity onPress={() => this.changePassword()}
                                          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} regular>
                            <Icon style={{marginLeft: 20, marginBottom: -6}} color="white" size={36} name="lock"/>
                            <Text style={{
                                marginLeft:22,
                                color: 'white',
                                fontStyle: 'normal',
                                fontSize: 16
                            }}>{strings.ChangePassword} </Text>

                        </TouchableOpacity>
                    </View>


            </View>


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
