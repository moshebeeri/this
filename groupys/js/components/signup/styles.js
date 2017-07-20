

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
        backgroundColor:'transparent',
    },
    this:{
        fontFamily:'BackToBlack',
        fontSize: 60,
        height:100,
        color:'white',
        marginTop:-40,
        paddingLeft:30,
        backgroundColor:'transparent',

    },

    phoneTextInput:{
        marginLeft:30,marginTop:5,backgroundColor:'white',height:50, width:width/2 + 120 } ,
    nameTextInput:{
        marginLeft:30,marginTop:5,backgroundColor:'white', height:50, width:width/2 - 35 } ,
    lastnameTextInput:{
        marginLeft:10,marginTop:5,backgroundColor:'white',height:50,  width:width/2 -35} ,
    passwordTextInput:{
        marginLeft:30,marginTop:5,backgroundColor:'white',height:50,  width:width/2 + 120 } ,
    nameContainer:{
        flexDirection: 'row',
    },
    signup_container:{
        marginLeft:0,
        marginTop:5,
        flexDirection: 'row',
        backgroundColor:'transparent',
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
        backgroundColor:'transparent',


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
    signgupText:{
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color:'white',
        marginLeft:100,
        backgroundColor:'transparent',
        textDecorationLine:'underline'


    },
    forgetText:{
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color:'white',
        marginLeft:30,
        backgroundColor:'transparent',
        textDecorationLine:'underline'


    },
    avoidView:{
        width:width -25,
        alignItems: 'center',
    },
};
