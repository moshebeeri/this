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
        backgroundColor:'white'

    },
    messageUsercomponent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'flex-start',


    },
    messageUserName: {
        flexDirection: 'column',
        borderBottomLeftRadius:15,
        borderTopRightRadius:50,
        borderBottomRightRadius:50,

        maxWidth:width  -100,
        backgroundColor:'#0699dc',
    },
    messageWideUserName: {
        flexDirection: 'column',
        borderBottomLeftRadius:15,
        borderTopRightRadius:50,
        borderBottomRightRadius:50,

        width:width  -60,
        backgroundColor:'#0699dc',
    },
    messageName: {
        flexDirection: 'column',

        borderTopLeftRadius:50,
        borderBottomLeftRadius:50,
        borderBottomRightRadius:15,
        maxWidth:width  -100,
        backgroundColor:'#0699dc',
    },
    message_container: {
        backgroundColor:'#0699dc',
        margin:5,
        justifyContent: 'flex-start',
        borderRadius:50,
    },
    dateUsercontainer: {
        justifyContent: 'flex-start',
        marginRight: 10,
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
        color: 'white',
        marginRight:20,


        marginLeft:20,
    },
    messageNameText:{
        color: 'white',
        marginRight:20,
        fontWeight:'bold',

        marginLeft:20,
    }
};
