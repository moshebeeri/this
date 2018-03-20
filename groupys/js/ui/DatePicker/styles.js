const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import { I18nManager } from 'react-native';
module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 85,
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 50,
    },
    textInputComponentLayout: {
        flexDirection: 'row'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',

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
        borderWidth:1,
        borderColor:'red'
    },
    textInputTitleContainer:{
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'flex-start' ,
    },
    textInputTextStyle: {
        color: '#666666',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        justifyContent:   'flex-start' ,
        marginLeft:  2,
        // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom:2,

    },
    textInputTextStyleWhite: {
        color: 'white',

        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,

    }
};





