const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
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
        justifyContent: 'flex-start',
    },
    textInputTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,
        marginBottom:5,

    },
    textInputTextStyleWhite: {
        color: 'white',

        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,

    }
};




