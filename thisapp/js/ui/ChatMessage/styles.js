const React = require('react-native');
import StyleUtils from '../../utils/styleUtils'
const {StyleSheet, Platform, Dimensions,I18nManager} = React;
const {width, height} = Dimensions.get('window')

const vh = height / 100

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
        borderTopLeftRadius:I18nManager.isRTL ? 8: 0,
        borderTopRightRadius:I18nManager.isRTL ? 0: 8,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,
        maxWidth:width  -50,

        backgroundColor:'white',
    },
    messageWideUserName: {
        flexDirection: 'column',
        borderBottomLeftRadius:8,
        borderTopLeftRadius:I18nManager.isRTL ? 0: 8,
        borderTopRightRadius:I18nManager.isRTL ? 8: 0,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,


        backgroundColor:'#2db6c8',
    },
    messageName: {
        flexDirection: 'column',
        justifyContent:'flex-end',
        borderTopLeftRadius:I18nManager.isRTL ? 0: 8,
        borderTopRightRadius:I18nManager.isRTL ? 8: 0,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        paddingRight:4,
        paddingLeft:4,
        maxWidth:width  -50,
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
        fontSize:  StyleUtils.scale(18)

    },
    messageTextWhite:{
        color: 'white',
        fontSize: StyleUtils.scale(18)

    },
    timeText:{
        color: '#616F70',

        marginBottom:8,
        marginRight:8,
        marginLeft:8,
        justifyContent:'flex-end',
        backgroundColor:'transparent',
        fontSize:StyleUtils.scale(12),

    },
    timeTextWhite:{
        color: 'white',

        marginBottom:8,
        marginRight:8,
        marginLeft:8,
        justifyContent:'flex-end',
        backgroundColor:'transparent',
        fontSize:StyleUtils.scale(12),

    },
    messageNameText:{
        color: 'white',
        marginRight:20,
        fontWeight:'bold',

        marginLeft:20,
    }
};
