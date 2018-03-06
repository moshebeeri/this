const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
module.exports = {
    messageComponent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems:'flex-start',
        backgroundColor:'#E6E6E6'

    },
    messageUsercomponent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'flex-start',


    },
    messageUserName: {
        flexDirection: 'column',
        borderBottomLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,

        maxWidth:width  -100,
        backgroundColor:'white',
    },
    messageWideUserName: {
        flexDirection: 'column',
        borderBottomLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,

        width:width  -60,
        backgroundColor:'#2db6c8',
    },
    messageName: {
        flexDirection: 'column',
        justifyContent:'flex-end',

        borderTopLeftRadius:8,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,
        maxWidth:width  -100,
        backgroundColor:'#2db6c8',
    },
    message_container_user: {
        backgroundColor:'transparent',
        margin:8,
        marginTop:4,
        justifyContent: 'flex-start',
        borderRadius:5,
    },
    message_container: {
        backgroundColor:'transparent',
        margin:5,
        justifyContent: 'flex-start',
        borderRadius:50,
    },
    dateUsercontainer: {
        justifyContent: 'flex-start',
        marginLeft: 12,
        marginBottom:2,
        flexDirection: 'row',
    },
    dateContainer: {

        justifyContent: 'flex-end',
        marginRight: 10,
        flexDirection: 'row',
    },
    dateFont: {
        fontFamily: 'Roboto-Regular', marginRight: 10, marginLeft: 10, marginTop: vh * 1, fontSize: 14, color: 'gray'
    },
    messageText:{
        color: '#616F70',
        fontSize: 18

    },
    messageTextWhite:{
        color: 'white',
        fontSize: 18

    },
    timeText:{
        color: '#616F70',

        marginBottom:8,
        marginRight:8,
        marginLeft:8,
        justifyContent:'flex-end',
        backgroundColor:'transparent',
        fontSize:12,

    },
    timeTextWhite:{
        color: 'white',

        marginBottom:8,
        marginRight:8,
        marginLeft:8,
        justifyContent:'flex-end',
        backgroundColor:'transparent',
        fontSize:12,

    },
    messageNameText:{
        color: 'white',
        marginRight:20,
        fontWeight:'bold',

        marginLeft:20,
    }
};
