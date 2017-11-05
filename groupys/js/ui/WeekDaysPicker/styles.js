const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 250,
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',


        height: 55,
    },
    checkboxContainerStyle:{
        marginTop:3,

    },
    textInputComponentLayout: {


        width:width,
        flexDirection:'row',
        backgroundColor:'white'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',

        flex: 1,
        padding: 10,
        borderRadius:2,
        fontSize:16,
    },
    textInputInvalidComponentStyle: {
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
        borderRadius:2,
        fontSize:16,
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





