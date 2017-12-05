import React, {Component} from 'react';
import {Dimensions, Platform} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import styles from './styles';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
export default class FormHeader extends Component {
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
        const {submitForm, showBack, title, bgc, submitIcon, titleColor, backIconColor} = this.props;
        let icon = <Icon2 active color={"white"} size={25} name={'check'}/>
        let headerHeight = vh * 7;
        if (Platform.OS === 'ios') {
            icon = <Icon active color={"white"} size={40} name={'ios-checkmark'}/>
            headerHeight = vh * 9;
        }
        if (submitIcon) {
            icon = submitIcon;
        }
        let iconColor = "white"
        if (backIconColor) {
            iconColor = backIconColor;
        }
        let back = undefined;
        if (showBack) {
            back = <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={() => this.back()}>
                <Icon active color={iconColor} size={25} name="ios-arrow-back"/>

            </Button>
        }
        let titleStyle = this.createTitleStyle(titleColor);
        return (
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
                    <Button transparent style={{justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => this.submitForm()}>
                        {icon}
                    </Button>
                    }
                </View>
            </View>
        );
    }
}


