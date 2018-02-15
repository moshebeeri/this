const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;

import StyleUtils from "../../utils/styleUtils";


import {I18nManager} from 'react-native';

module.exports = {
    logo_view: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        width:StyleUtils.getWidth(),

    },
    logo_view_no_margin: {
        flexDirection: 'row',
        backgroundColor: 'white',
       paddingTop: (Platform.OS === 'ios') ? 0 : 0,
        width:StyleUtils.getWidth(),
    },
    businessNameText: {
        fontFamily: 'Roboto-Regular',
        fontWeight: 'bold',
        alignSelf:  'flex-start' ,
        marginLeft: I18nManager.isRTL ? 5 : 0,
        marginRight: I18nManager.isRTL ? 0 : 5,
        fontSize: 18,
    },
    businessColorNameText: {
        fontFamily: 'Roboto-Regular',
        fontWeight: 'bold',
        color: '#ff6400',
        alignSelf:  'flex-start' ,
        marginLeft:  5 ,
        //marginRight: I18nManager.isRTL ? 0 : 5,
        fontSize: 18,
    },
    businessAddressText: {
        fontFamily: 'Roboto-Regular',
        marginLeft: 5 ,
      //  marginRight: I18nManager.isRTL ? 0 : 5,
        alignSelf:'flex-start',
        color: 'gray',
        fontSize: 16
    },
};
