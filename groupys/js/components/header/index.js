import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Platform, Dimensions} from 'react-native';
import {View, Button, InputGroup, Tabs, Tab, TabHeading, Input, Text, Header} from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
import styles from './styles';
// import Icon from 'react-native-vector-icons/Ionicons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';

export default class GeneralComponentHeader extends Component {
    constructor(props) {
        super(props);
    }

    refreshContact() {
        //contactApi.syncContacts();
    }

    realize() {
        this.props.navigate('realizePromotion')
    }

    back() {
        this.props.navigation.goBack();
    }

    followBusiness() {
        this.props.navigate("businessFollow");
    }

    onBoardingPromotion() {
        this.props.navigate("businessFollow");
    }

    render() {
        let back = undefined;
        if (this.props.showBack) {
            back = <Button transparent style={{}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

            </Button>
        }
        let menuAction = <Menu>
            <MenuTrigger>
                <Icon2 style={{fontSize: 25, color: "#2db6c8"}} name="options-vertical"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.followBusiness.bind(this)}>
                    <Text>Follow Business</Text>
                </MenuOption>
                <MenuOption onSelect={this.onBoardingPromotion.bind(this)}>
                    <Text>On Boarding Promotions</Text>
                </MenuOption>

            </MenuOptions>
        </Menu>
        return (



            <View style={{
                height: vh * 7, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                justifyContent: 'space-between',
            }}>
                <View style={{height: vh * 7, flexDirection: 'row', alignItems: 'flex-start'}}>
                    {back}
                    <Button transparent style={{}} onPress={this.props.openDrawer}>
                        <Icon2 active color={"#2db6c8"} size={20} name="menu"/>

                    </Button>
                </View>

                <Text transparent style={{color: "#2db6c8", backgroundColor: 'transparent'}}>ThisCounts</Text>
                <View style={{
                    justifyContent: 'flex-start', height: vh * 5,
                }}>
                    {menuAction}
                </View>
            </View>








        );
    }
}


