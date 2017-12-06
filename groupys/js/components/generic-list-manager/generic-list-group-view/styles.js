const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
module.exports = {
    group_container: {
        width: width,
        height: vh * 43,
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: 'white'
    },
    group_description: {
        width: width,
        height: vh * 15,
        flexDirection: 'row',
        borderColor: 'gray',
        justifyContent: 'flex-start',
    },
    group_message_container: {
        margin: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'gray',
    },
    group_promotion_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    group_content: {
        width: width - 10,
        height: 40,
        flexDirection: 'column',
        borderWidth: 0,
    },
    group_messages: {
        width: width - 10,
        height: 40,
        flexDirection: 'row',
        borderWidth: 0,
        borderTopWidth: 0.5,
        borderTopColor: '#dbdbdb',
        borderRightWidth: 1
    },
    group_promotion: {
        width: width - 15,
        height: 60,
        flexDirection: 'row',
        borderTopColor: '#dbdbdb',
        borderTopWidth: 1,
    },
    group_image: {
        flex: 0.5,
        justifyContent: 'center',
    },
    group_name: {
        marginTop: 10,
        width: vw * 44,
        height: vh * 11,
    },
    message_container: {
        flex: 3,
        paddingBottom:8,
    },
    group_name_text: {
        fontFamily: 'Roboto-Regular', fontWeight: 'bold', marginLeft: 10, marginTop: 0, fontSize: 24, color: 'black'
    },
    group_members: {
        fontFamily: 'Roboto-Regular', marginLeft: 2, marginTop: 2, fontSize: 16, color: 'black'
    },
    dateFont: {
        fontFamily: 'Roboto-Regular', marginRight: 2, marginLeft: 2, fontSize: 12, color: 'gray'
    },
    latest_text: {
        fontFamily: 'Roboto-Regular', fontSize: 12, color: 'gray'
    },
    latest_text_container: {
        width: width - 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    date_container: {
        width: vw * 20,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    message_date_container: {
        height: vh * 10,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1,
    },
    promotion_image: {
        flex: 1,
        alignSelf: 'stretch',
        marginTop: 5,
        marginLeft: 5,
    },
    promotion_image_view: {
        height: 50, width: 50
    },
};
