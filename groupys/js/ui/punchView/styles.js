const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {I18nManager} from 'react-native';

module.exports = {
    punch: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ff6400',
        marginRight: 5,
        marginLeft: 5,
    },
    punchFeed: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2db6c8',
        marginRight: 5,
        marginLeft: 5,
    },
    container: {
        flexDirection: 'row',
        height: 30,
        width: width,
        alignItems: 'center',
        //paddingRight: I18nManager.isRTL ? 0 : 30,
        justifyContent: 'flex-start' ,
    }
};





