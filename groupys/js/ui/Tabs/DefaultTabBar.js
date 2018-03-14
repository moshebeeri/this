const React = require('react');
const {ViewPropTypes, Image, I18nManager, Platform} = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const notification = require('../../../images/notification.png');
const createReactClass = require('create-react-class');
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {ThisText} from '../index';

const {
    StyleSheet,
    Text,
    View,
    Animated,
} = ReactNative;
const Button = require('./Button');
const DefaultTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,
    },
    getDefaultProps() {
        return {
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
        };
    },
    createTabvView(name) {
        if (name === 'promotions') {
            return <SimpleLineIcons size={28} color={'#2db6c8'}
                                    name="layers"/>
        }
        if (name.includes('notification')) {
            let notifications = parseInt(name.substring('notification'.length + 1))
            if (notifications > 0) {
                let addedPlus = undefined;
                let styleNotification = {
                    position: 'absolute',
                    bottom: 18,
                    right: 17,
                    borderRadius: 10,
                    width: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FA8559'
                };
                if (notifications > 20) {
                    addedPlus = '+';
                    notifications = 20;
                    styleNotification = {
                        position: 'absolute',
                        bottom: 18,
                        right: 17,
                        borderRadius: 15,
                        height: 25,
                        width: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FA8559'
                    };
                }
                return <View>

                    <MaterialCommunityIcons size={35} color={'#2db6c8'} style={{marginRight: 10}}
                                            name="bell-outline"/>

                    <View style={styleNotification}>
                        <ThisText style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: 'white'
                        }}>{addedPlus}{notifications}</ThisText>
                    </View>
                </View>
            }
            return <EvilIcons size={35} color={'#2db6c8'}
                              name="bell"/>
        }
        if (name === 'groups') {
            return <Ionicons size={42} color={'#2db6c8'}
                             name="ios-people-outline"/>
        }
        if (name === 'save') {
            return <SimpleLineIcons size={25} color={'#2db6c8'}
                                    name="tag"/>
        }

        if(name === 'chat'){
            return <SimpleLineIcons size={25} color={'#2db6c8'}
                                    name="bubble"/>
        }
        return <ThisText style={[{color: '#2db6c8'}]}>
            {name}
        </ThisText>
    },
    renderTabOption(name, page) {
    },
    renderTab(name, page, isTabActive, onPressHandler) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        const tabView = this.createTabvView(name);
        return <Button
            style={{flex: 1,}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle,]}>
                {tabView}
            </View>
        </Button>;
    },
    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 4,
            backgroundColor: 'navy',
            bottom: 0,
            marginLeft: I18nManager.isRTL && (Platform.OS === 'android') ? containerWidth - containerWidth / numberOfTabs : 0,
        };
        let translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs],
        });
        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,}, this.props.style,]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View
                    style={[
                        tabUnderlineStyle,
                        {
                            transform: [
                                {translateX},
                            ]
                        },
                        this.props.underlineStyle,
                    ]}
                />
            </View>
        );
    },
});
const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
});
module.exports = DefaultTabBar;
