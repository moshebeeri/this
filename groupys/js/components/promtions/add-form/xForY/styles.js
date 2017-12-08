const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
import {I18nManager} from 'react-native';
module.exports = {
    header: {
        width: Dimensions.get('window').width,
        marginLeft: (Platform.OS === 'ios') ? undefined : -15
    },

    button: {
        backgroundColor: 'transparent'
    },
    inputTextLayout: {
        marginTop: 4, padding: 3,
        width: width - 15
    },

    inputPrecenComponent: {

        marginRight:5,
        flex:1.4
    },

    inputRetailComponent: {
        marginRight:5,
        marginLeft:5,
        width: 115
    },
    textLayout: {
        marginTop: 4, padding: 3,
        justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',
        alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
        width: width - 15
    },
};
