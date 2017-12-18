const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
import {I18nManager} from 'react-native';

module.exports = {
    logo_view: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    logo_view_no_margin: {
        flexDirection: 'row',
        backgroundColor: 'white',
       paddingTop: (Platform.OS === 'ios') ? 5 : 5,
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
