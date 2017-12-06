import loginTheme from './general-theme';

const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
module.exports = {
    itemborder: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        backgroundColor: 'white',
        borderColor: 'black',
        width: width / 1.4
    },
    icon: {
        backgroundColor: 'white',
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        width: width,
        height: vh * 10,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    imageStyle: {
       flex:1.4,
        justifyContent:'center',
        alignItems:'center',


    },
    invite_to_group: {
        marginTop: 7,
    },
    group_title: {
        flexDirection: 'column',
        height: 50,
        width: width / 2
    },
    group_name_text: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto',
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5,
        fontSize: 24,
        color: 'black'
    },
    group_members: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto',
        marginLeft: 10,
        marginTop: 5,
        fontSize: 16,
        color: 'black'
    },
    headerTabContainer: {
        height: vh * 8,
        width: width,
        backgroundColor: '#b7b7b7',
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerTabInnerContainer: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        height: vh * 8,
        width:width - 15,
        backgroundColor: '#b7b7b7',
    },
    נpromotionButtonOn: {
        height: 45,
        flex:1,

        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#bfbfbf',
        alignItems:'center',
        justifyContent:'center',
    },
    promotionButtonOff: {
        height: 45,
        flex:1,

        backgroundColor: '#E5E7E9',
        borderWidth: 2,
        borderColor: '#bfbfbf',
        alignItems:'center',
        justifyContent:'center',
    },
    chatButtonOn: {
        height: 45,
        flex:1,

        borderWidth: 2,
        backgroundColor: 'white',
        borderColor: '#bfbfbf',
        alignItems:'center',
        justifyContent:'center',
    },
    נchatButtonOFf: {
        height: 45,
        flex:1,

        borderWidth: 2,
        backgroundColor: '#E5E7E9',
        borderColor: '#bfbfbf',

        alignItems:'center',
        justifyContent:'center',
    },
    group_text_off: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto',
        marginLeft: 0,
        marginTop: 5,
        fontSize: 18,
        color: 'black'
    },
    group_text_on: {
        fontFamily: (Platform.OS === 'ios') ? 'Roboto' : 'Roboto',
        marginLeft: 0,
        marginTop: 5,
        fontSize: 18,
        color: '#99A3A4'
    },
    comments_promotions: {
        padding: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    comments_logo: {
        marginLeft: 10
    },
    comment_description_container: {
        flexDirection: 'column',
        width: width / 2 + 30
    },
    promotion_text_description: {
        fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 0, fontSize: 14, color: 'black'
    },
    promotion_type: {
        fontFamily: 'Roboto-Regular', fontWeight: 'bold', marginLeft: 10, marginTop: 5, fontSize: 18, color: 'black'
    },
    comment_colapse: {
        marginTop: 10,
    },
    message_container: {
        width: width,
        flex: -1,
    },
    group_actions: {
        flexDirection: 'row',
        flex:1.8,
        marginBottom:15,

        justifyContent: 'center',

    },
};
