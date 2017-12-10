const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import { I18nManager } from 'react-native';
module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 75,
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 55,
    },
    textInputComponentLayout: {
        flexDirection: 'row'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',
        justifyContent:  'flex-start',
        flex: 1,
        padding: 10,
        borderRadius:2,
        fontSize:16,
        paddingLeft:  I18nManager.isRTL ? 10:50,
    },

    textInputDisabledComponentStyle: {
        backgroundColor: '#CACFD2',
        justifyContent:   'flex-start' ,
        flex: 1,
        padding: 10,
        borderRadius:2,

    },
    textInputInvalidComponentStyle: {
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
        borderRadius:2,
        justifyContent:  I18nManager.isRTL ? 'flex-start' : 'flex-start',
        fontSize:16,
        borderWidth:1,
        borderColor:'red'
    },
    textInputTitleContainer:{
        flexDirection: 'row',
        justifyContent:  'flex-start'
    },
    textInputTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        justifyContent:   'flex-start' ,
        marginLeft:  10,
       // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom:5,

    },
    textInputTextStyleWhite: {
        color: 'white',
        justifyContent:  'flex-start' ,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,

    }
};





