import loginTheme from './login-theme';

const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    inputContainer: {

        justifyContent: 'center',
        alignItems: 'center',

        height:height


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
    thisContainer: {

        width:width,


        justifyContent: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
    },
    this: {
        // fontFamily:'BackToBlack',
        marginTop:150,
        fontSize: 50,
        color: 'white',
        fontWeight:'bold',
        backgroundColor: 'transparent'
    },
    phoneTextInput: {
        marginTop: 5, backgroundColor: 'transparent', height: 50, width: width / 2 + 120,
        justifyContent: 'center',
        alignItems:'center',
    },
    passwordTextInput: {
        marginTop: 10, backgroundColor: 'transparent', height: 50, width: width / 2 + 120,
        justifyContent: 'center',
        alignItems:'center',
    },
    signup_container: {

        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'column',
        marginTop:10,

    },
    thiscount: {
        fontFamily:(Platform.OS === 'ios') ? 'Roboto-Regular' : 'BackToBlack',
        fontSize: 60,
        marginTop: -20,
        color: 'white',
    },
    SignUpText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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
    signgupText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: 'white',
        marginLeft: 5,
        fontWeight:'bold',
        backgroundColor: 'transparent'
    },
    forgetText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        backgroundColor: 'transparent',
        marginTop:10,
    },
};
