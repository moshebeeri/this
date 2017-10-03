const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    button: {
        width: width,
        height: 46,
        justifyContent: 'center',
        marginTop: 10
    },
    buttonText: {
        paddingLeft: width / 2 - 20,
        fontSize: 20,
        color: 'white',
        justifyContent: 'center'
    },
    thumbnail: {
        marginLeft: 70,
        paddingLeft: 90,
        paddingTop: 90,
    },
    like: {
        marginLeft: 15,
        marginRight: 5,
    },
    likeText: {
        marginTop: 15,
    },
    buttonLike: {},
    buttonView: {
        flex: -1, justifyContent: 'center', flexDirection: 'row', height: 55,
    },
    iconView: {
        flex: -1, justifyContent: 'center', flexDirection: 'row', height: 30,
    },
    image: {
        width: width - 50,
        height: 300,
        flex: -1,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    imageLogoName: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold', marginLeft: 2, fontSize: 18, color: 'white'
    },
    imageTopText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold', marginLeft: 20, marginTop: 5, fontSize: 20, color: 'white'
    },
    imageButtomText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold',
        marginRight: 20,
        marginLeft: -50,
        marginTop: 20,
        marginBottom: 10,
        color: 'white',
        fontSize: 15
    },
    addressText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold',
        marginRight: 20,
        marginLeft: 10,
        marginTop: 15,
        marginBottom: 15,
        color: 'white',
        fontSize: 15
    },
    backdropView: {
        height: 300,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
        height: 300,
        overflow: 'hidden',
        backgroundColor: '#ba5133',
        alignItems: 'center',
        borderRadius: 15
    },
    overlay: {
        opacity: 0.5,
    },
    logo: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: 160,
        height: 52
    },
    backdrop: {
        flex: 1,
        flexDirection: 'column'
    },
    headline: {
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white'
    },
    promotion_container: {
        flex: 1,
        height: 195,
        width: width,
        overflow: 'hidden',
        backgroundColor: '#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',
    },
    bussiness_container: {
        flex: 1,
        height: 430,
        width: width,
        overflow: 'hidden',
        backgroundColor: '#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',
    },
    promotion_card: {
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#b7b7b7',
        width: width,
        borderRadius: 2,
    },
    promotion_image: {
        width: 110, height: 110, borderWidth: 10
    },
    promotion_upperContainer: {
        backgroundColor: 'white',
        width: width - 20,
        borderRadius: 2,
        height: 120,
        flexDirection: 'column'
    },
    bussiness_upperContainer: {
        backgroundColor: 'white',
        width: width - 20,
        borderRadius: 2,
        height: 50,
        flexDirection: 'column'
    },
    logo_view: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 10
    },
    promotion_description: {
        flexDirection: 'column',
        margin: 10,
        height: 50,
        marginTop: 2
    },
    promotion_buttom_description: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 2
    },
    promotion_buttom_location: {
        flexDirection: 'row',
        marginTop: 5
    },
    promotion_backdropView: {
        height: 200,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    promotion_type: {
        fontFamily: 'Roboto-Regular', fontWeight: 'bold', marginLeft: 10, marginTop: 5, fontSize: 18, color: 'black'
    },
    promotion_name: {
        fontFamily: 'Roboto-Regular', fontWeight: 'bold', marginLeft: 10, marginTop: 5, fontSize: 20, color: 'black'
    },
    promotion_desc: {
        fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 0, fontSize: 14, color: 'black'
    },
    promotion_text_description: {
        fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 0, fontSize: 14, color: 'black'
    },
    promotion_buttonText: {
        paddingTop: 10,
        paddingLeft: 0,
        fontSize: 20,
        color: 'white',
        justifyContent: 'center',
        fontFamily: 'Roboto-Regular'
    },
    promotion_buttonView: {
        flex: -1, justifyContent: 'center', flexDirection: 'row', height: 50, width: width, backgroundColor: '#363636'
    },
    promotion_iconView: {
        flex: -1, justifyContent: 'center', flexDirection: 'row', height: 40, width: 100
    },
    promotion_buttomUpperContainer: {
        backgroundColor: 'white',
        width: width - 20,
        height: 135,
        flexDirection: 'row',
        marginTop: 0,
    },
    promotion_nameContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 0.3,
        borderColor: '#b7b7b7',
        width: width - 20,
        height: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 0,
    },
    business_buttomUpperContainer: {
        backgroundColor: 'white',
        width: width - 20,
        height: 80,
        flexDirection: 'row',
        marginTop: 0,
    },
    promotion_bottomContainer: {
        backgroundColor: 'white',
        width: width - 18,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        flexDirection: 'row',
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#e0e0eb',
    },
    promotion_like: {
        marginLeft: 10,
        marginRight: 10,
        color: 'red',
    },
    promotion_unlike: {
        marginLeft: 10,
        marginRight: 10,
    },
    promotion_location: {
        marginLeft: 10,
        marginRight: 0,
    },
    promotion_comment: {
        marginLeft: 10,
        marginRight: 10,
    },
    promotion_addressText: {
        fontFamily: 'Roboto-Regular',
        marginRight: 20,
        marginLeft: 10,
        marginTop: 0,
        marginBottom: 0,
        color: 'gray',
        fontSize: 16
    },
    promotion_nameText: {
        fontFamily: 'Roboto-Black',
        fontWeight: 'bold',
        marginRight: 20,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        color: 'black',
        fontSize: 18
    },
    messageContainer: {
        flexDirection: 'row',
        margin: 2,
        borderWidth: 0,
        maxWidth: width - 20
    },
    message_Container: {
        flexDirection: 'row',
        width: width,
    },
    messageName: {
        margin: 5,
        flexDirection: 'column',
    }
};
