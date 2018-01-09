import React, {Component} from 'react';
import {Dimensions,TouchableOpacity,Image,Platform,TextInput} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View,Spinner} from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import * as notificationAction from "../../actions/notifications";
import * as businessAction from "../../actions/business";
import * as groupsAction from "../../actions/groups";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

const qrcode = require('../../../images/qr-code.png');
import strings from "../../i18n/i18n"
import { I18nManager } from 'react-native';

class GeneralComponentHeader extends Component {
    constructor(props) {

        super(props);

        this.state = {
            search:''
        }
    }

    realize() {
        this.props.navigate('realizePromotion')
    }

    back() {
        this.props.navigation.goBack();
    }
    showPromotionScaning() {
        this.props.navigate('ReadQrCode');
    }
   searchBusiness() {
        this.props.businessActions.showSearchForm('business',strings.SearchBusiness);

    }
    searchGroups() {
        this.props.businessActions.showSearchForm('groups',strings.SearchGroups);

    }

    resetSearch(){
        this.props.businessActions.resetFollowForm();
    }


    followBusiness() {
        this.props.navigate("businessFollow");
    }


    search(){
        let searchParams = this.state.searchText;
        if(this.props.state.searchType==='business') {
            this.props.businessActions.searchBusiness(searchParams)
        }else{
            this.props.groupsAction.searchGroup(searchParams)
        }
        this.setState({
            searchText:''
        })
    }


    render() {
        const {businessActions,state,network} = this.props;
        let back = undefined;
        let headerHeight = vh *7;
        if (Platform.OS === 'ios') {
            headerHeight = vh *9;
        }

        if (this.props.showBack) {
            back = <Button transparent style={{marginLeft:5,marginRight:5}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

            </Button>
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";

        if(state.searchType){
            return (
                <View>
                    {network.offline &&  <View style={{width:width,height:20,justifyContent:'center',alignItems:'center',backgroundColor:'#f4ce42'}}>
                        <Text style={{color:'gray'}}>Offline</Text>
                    </View>}
                <View style={{
                    height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                    justifyContent: 'space-between',
                }}>
                     <TouchableOpacity transparent style={{marginLeft:5,marginRight:0, alignItems: 'center',justifyContent: 'center'}} onPress={() => this.resetSearch()}>
                    <View style={{alignItems:'flex-start',marginTop:10,justifyContent:'flex-end',marginLeft:10,width:30}}>
                    <Icon active color={"#2db6c8"} size={25} name={arrowName}/>
                    </View>

                </TouchableOpacity>
                    <TextInput style={{color: "#888888",marginLeft:10,marginRight:40,marginTop:10,fontSize:18,width:width - 100,height:headerHeight -20}}
                               underlineColorAndroid='transparent'
                               value={this.state.searchText}
                               autoFocus={true}
                               returnKeyType='search'
                               onSubmitEditing={this.search.bind(this)}
                               onChangeText={(searchText) => this.setState({searchText})}
                               placeholder={state.searchPlaceHolder}
                    />
                    {state.searching && <Spinner style={{right:20,position:'absolute'}}/>}

                </View>
                </View>
            );

        }
        let menuAction = <Menu>
            <MenuTrigger>
                <Icon style={{fontSize: 30, color: "#2db6c8"}} name="ios-search"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.searchBusiness.bind(this)}>
                    <Text>{strings.SearchBusiness}</Text>
                </MenuOption>
                <MenuOption onSelect={this.searchGroups.bind(this)}>
                    <Text>{strings.SearchGroups}</Text>
                </MenuOption>


            </MenuOptions>
        </Menu>
        return (
            <View>
                {network.offline &&   <View style={{width:width,height:20,justifyContent:'center',alignItems:'center',backgroundColor:'#f4ce42'}}>
                    <Text style={{color:'gray'}}>{strings.Offline}</Text>
                </View>}
            <View style={{
                height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                justifyContent: 'space-between',
            }}>

                { <View style={{height: vh * 7, flexDirection: 'row', alignItems: 'flex-start'}}>
                    {back}

                    <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={this.props.openDrawer}>
                        <Icon2 active color={"#2db6c8"} size={20} name="menu"/>

                    </Button>

                </View>
                }

                <Text transparent style={{color: "#2db6c8", backgroundColor: 'transparent'}}>THIS</Text>
                {<View style={{
                    height: vh * 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                    {menuAction}
                    <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                      style={{
                                          width: 30, height: 30,
                                          marginRight:5,
                                          marginLeft:5,
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                      }}
                                      regular>
                        <Image resizeMode="cover" style={{tintColor: '#2db6c8', marginTop: 3, width: 25, height: 25}}
                               source={qrcode}/>

                    </TouchableOpacity>

                </View>
                }

            </View>
            </View>

        );
    }
}

export default connect(
    state => ({
        notification: state.notification,
        state: state.follow_businesses,
        network:state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch),
        businessActions: bindActionCreators(businessAction, dispatch),
        groupsAction: bindActionCreators(groupsAction, dispatch),
    })

)(GeneralComponentHeader);

