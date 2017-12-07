const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import { I18nManager } from 'react-native';
module.exports = {
    picker: {
        margin: 3, height: 50, width: width - 25, backgroundColor: 'white',justifyContent:  I18nManager.isRTL ? 'flex-start' : 'flex-end'
    },
    pickerInvalid: {
        margin: 3, height: 50, width: width - 25, backgroundColor: 'red',justifyContent:  I18nManager.isRTL ? 'flex-start' : 'flex-end',borderWidth:1,borderColor:'red'
    },
    pickerTitleContainer:{
        flexDirection: 'row',
        justifyContent:  I18nManager.isRTL ? 'flex-start' : 'flex-end'
    },
    pickerTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,
        marginBottom:5,

    },
};





