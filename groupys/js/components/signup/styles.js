const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    inputContainer: {
        flex: -1,
        height: height,
        width: width,
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
        height: 250,
        marginTop: height / 40,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
    },
    this: {
        // fontFamily:'BackToBlack',
        marginTop:150,
        fontSize: 90,
        color: 'white',
        fontWeight:'bold',
        backgroundColor: 'transparent'
    },
    phoneTextInput: {
        marginTop: 5, backgroundColor: 'transparent', height: 60, width: width / 2 + 120,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection:'row'
    },
    firstLastNameContainer: {
        marginTop: 5, backgroundColor: 'transparent', height: 60, width: width / 2 + 120,
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    passwordTextInput: {
        marginTop: 10, backgroundColor: 'transparent', height: 50, width: width / 2 + 120,
        justifyContent: 'center',
        alignItems:'center',
    },
    nameTextInput: {
        marginTop: 5, backgroundColor: 'transparent', height: 50, width: 150,

    },
    lastnameTextInput: {
        marginTop: 5, backgroundColor: 'transparent', height: 50, width:150,

    },

    nameContainer: {
        width: width / 2 + 120,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    signup_container: {
        width: width / 2 + 120,
        marginTop: 5,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'flex-start'
    },
    thiscount: {
        fontFamily: (Platform.OS === 'ios') ? 'BackToBlack' : 'Back To Black',
        fontSize: 60,
        color: 'white',
        marginTop: -40,
    },
    SignUpText: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        marginTop: 40,
        backgroundColor: 'transparent',
    },
    logoButton: {
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    logoGoogle: {
        backgroundColor: '#b63a48',
        paddingHorizontal: 10,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    logoFacebook: {
        backgroundColor: '#3541A9',
        paddingHorizontal: 10,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start',
    },
    signgupText: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        marginLeft: 100,
        backgroundColor: 'transparent',
        textDecorationLine: 'underline'
    },
    forgetText: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        backgroundColor: 'transparent',
        textDecorationLine: 'underline'
    },
    avoidView: {
        alignItems: 'center',

    },
};
