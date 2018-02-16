import React, {Component} from 'react';
import {Dimensions, I18nManager, Platform, TouchableOpacity,TextInput} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import styles from './styles';
import strings from "../../i18n/i18n"
import {connect} from 'react-redux';
import {ThisText} from '../../ui/index';

const {width, height} = Dimensions.get('window')

const vh = height / 100
import StyleUtils from "../../utils/styleUtils";

class FormHeader extends Component {
    constructor(props) {
        super(props);
        this.state={
            showSearch:false,
            searchText:'',
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    submitForm() {
        const {submitForm, disableAction} = this.props;
        if (disableAction) {
            return
        }
        submitForm()
    }

    createTitleStyle(titleColor) {
        if (titleColor) {
            return {
                color: titleColor,
                fontSize: 16,
                backgroundColor: 'transparent'
            }
        }
        return styles.formHeadrTitleStyle;
    }


    filter(){
        this.setState({
            showSearch:true
        })
    }

    searchText(text){
        const{filter} = this.props;
        this.setState({
            searchText:text
        })
        if(filter){
            filter(text);
        }

    }
    render() {
        const {filter,submitForm, showBack, title, bgc, submitIcon, titleColor, backIconColor,network} = this.props;
        let icon = <Icon2 active color={"white"} size={25} name={'check'}/>
        let headerHeight = vh * 7;
        if (Platform.OS === 'ios') {
            icon = <Icon active color={"white"} size={30} name={'ios-checkmark'}/>
            headerHeight = vh * 9;
        }
        if (submitIcon) {
            icon = submitIcon;
        }
        let iconColor = "white"
        if (backIconColor) {
            iconColor = backIconColor;
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        let back = undefined;
        if (showBack) {
            back = <TouchableOpacity transparent style={{
                width: 80,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginLeft: 5,

                marginRight: 5
            }} onPress={() => this.back()}>
                <Icon active color={iconColor} size={25} name={arrowName}/>

            </TouchableOpacity>
        }
        let titleStyle = this.createTitleStyle(titleColor);
        return (
            <View style={{width:StyleUtils.getWidth()}}>
                {network.offline &&   <View style={{width:width,height:20,justifyContent:'center',alignItems:'center',backgroundColor:'#f4ce42'}}>
                    <ThisText style={{color:'gray'}}>{strings.Offline}</ThisText>
                </View>}
            <View style={{
                height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: bgc,
                justifyContent: 'center',
            }}>
                <View style={styles.formHeaderBackButoon}>
                    {back}
                </View>
                <View style={{
                    flex: 5, justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {!this.state.showSearch && <ThisText transparent style={titleStyle}>{title}</ThisText>}
                    {this.state.showSearch &&
                    <TextInput style={{
                        color: "white",
                        marginLeft: 10,
                        marginRight: 40,
                        marginTop: 5,

                        fontSize: 18,
                        width: StyleUtils.getWidth() - 100,
                        height:40
                    }}
                               placeholderTextColor={'white'}
                               underlineColorAndroid='transparent'
                               value={this.state.searchText}
                               autoFocus={true}
                               returnKeyType='search'
                               onChangeText={(searchText) => this.searchText(searchText)}
                               placeholder={'Search'}
                    />}
                </View>

                <View style={styles.formHeaderSubmitButoon}>
                    {submitForm &&
                    <TouchableOpacity transparent
                                      style={{width: 50, alignItems: 'flex-end', justifyContent: 'flex-end'}}
                                      onPress={() => this.submitForm()}>
                        {icon}
                    </TouchableOpacity>
                    }

                    {filter && !this.state.showSearch &&
                    <TouchableOpacity transparent
                                      style={{width: 50, alignItems: 'flex-end', justifyContent: 'flex-end'}}
                                      onPress={() => this.filter()}>
                        <Icon style={{fontSize: 30, color: "white"}} name="ios-search"/>
                    </TouchableOpacity>
                    }


                </View>


            </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        network: state.network,
    }),
)(FormHeader);
