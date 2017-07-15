import loginTheme from './login-theme';

const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')

module.exports = {

    inputContainer: {
        flex:-1,
        height:height,
        width:width,

    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: (Platform.OS === 'ios') ? 10 : 0,
        marginTop: (Platform.OS === 'ios') ? -10 : 0,
    },
    forgotText: {
        alignSelf: 'flex-end',
        fontSize: 14,
        textDecorationLine: 'underline',
        color: '#000',
        marginBottom: (Platform.OS === 'ios') ? 10 : 0,
        marginTop: (Platform.OS === 'ios') ? -10 : 0,
    },

    signUpHereText: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color: '#00F',

    },
    thiscountsContainer:{
        height: 100,
        marginTop:100,
        marginLeft:width/2 - 80,
        justifyContent:'center',
    },
    this:{
        fontFamily:'BackToBlack',
        fontSize: 60,
        color:'white',
        marginTop:-40,
        paddingLeft:30

    },

    phoneTextInput:{
        marginLeft:30,marginTop:5,backgroundColor:'white', width:width/2 + 120 } ,
    passwordTextInput:{
        marginLeft:30,marginTop:10,backgroundColor:'white', width:width/2 + 120 } ,

    signup_container:{
        marginLeft:0,
        marginTop:5,
        flexDirection: 'row',
    },
    thiscount:{
        fontFamily:'BackToBlack',
        fontSize: 60,
        color:'white',
        marginTop:-40,

    },
    signginText:{
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color:'white',
        marginLeft:30,
        marginTop:40,
        textDecorationLine:'underline'


    },
    login: {
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: loginTheme.darkenButton,
        paddingHorizontal: 40,
    },
    logoButton: {
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    logoGoogle: {
        backgroundColor: '#b63a48',
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    logoFacebook: {
        backgroundColor: '#3541A9',
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start',
    },
    signgupText:{
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color:'white',
        marginLeft:100,
        textDecorationLine:'underline'


    },
    forgetText:{
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color:'white',
        marginLeft:30,
        textDecorationLine:'underline'


    },
};
