const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window');
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

    inputPercentComponent: {

        marginRight:5,
        flex:2.5
    },

    inputRetailComponent: {
        marginRight:5,
        marginLeft:5,
        width: 115
    },
    textLayout: {
        marginTop: 4, padding: 3,
        justifyContent:'flex-start',
        alignItems: 'flex-start' ,
        width: width - 15
    },
};
