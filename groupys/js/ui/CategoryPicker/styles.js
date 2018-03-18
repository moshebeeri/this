const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import { I18nManager } from 'react-native';
module.exports = {
    picker: {
        marginTop: 5, height: 50, width: width - 25, backgroundColor: 'white',justifyContent:   'flex-start'
    },
    pickerInvalid: {
        marginTop: 5, height: 50, width: width - 25, backgroundColor: 'red',justifyContent:  'flex-start' ,borderWidth:1,borderColor:'red'
    },
    pickerTitleContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pickerTextStyle: {
        color: '#666666',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        justifyContent:   'flex-start' ,
        marginLeft:  2,
        marginBottom:2,

    },
};





