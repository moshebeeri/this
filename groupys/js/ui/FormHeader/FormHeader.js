import React, {Component} from 'react';
import {Dimensions, I18nManager, Platform, TouchableOpacity} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import styles from './styles';
import strings from "../../i18n/i18n"
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window')

const vh = height / 100
import StyleUtils from "../../utils/styleUtils";

class FormHeader extends Component {
    constructor(props) {
        super(props);
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

    render() {
        const {submitForm, showBack, title, bgc, submitIcon, titleColor, backIconColor,network} = this.props;
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
                width: 50,
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
                    <Text style={{color:'gray'}}>{strings.Offline}</Text>
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
                    <Text transparent style={titleStyle}>{title}</Text>
                </View>

                <View style={styles.formHeaderSubmitButoon}>
                    {submitForm &&
                    <TouchableOpacity transparent
                                      style={{width: 50, alignItems: 'flex-end', justifyContent: 'flex-end'}}
                                      onPress={() => this.submitForm()}>
                        {icon}
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
