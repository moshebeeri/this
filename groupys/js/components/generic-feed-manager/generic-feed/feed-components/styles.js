const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
import {I18nManager} from 'react-native';

module.exports = {
    button: {
        width: vmin * 100,
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
    imageBottomText: {
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
        height: 81 * vh,
        width: width,
        overflow: 'hidden',
        backgroundColor: 'red',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom:5,
    },
    businesses_container: {
        flex: 1,
        height: vh * 76,
        width: width,
        overflow: 'hidden',
        backgroundColor: '#cccccc',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',
    },
    Welcome_container: {
        flex: 1,
        height: 18 * vh,
        width: width,
        overflow: 'hidden',
        backgroundColor: '#cccccc',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',
    },
    promotion_card: {
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#cccccc',
        width: width,
        marginBottom: 12,
        flex: 1,
        borderRadius: 2,
    },
    promotion_image: {
        flex: 1,
        alignSelf: 'stretch',
        width: width,
        height: 250,
    },
    promotion_image_view: {
        width: width,  height: 250
    },
    promotion_upperContainer: {
        backgroundColor: 'white',
        width: width - 15,
        borderRadius: 2,
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    promotioSharedUpperContainer: {
        backgroundColor: 'white',
        width: width - 15,
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    businesses_upperContainer: {
        backgroundColor: 'white',
        width: width,
        borderRadius: 2,
        height: vh * 7,
        flexDirection: 'column'
    },
    welcome_upperContainer: {
        backgroundColor: 'white',
        width: width,
        borderRadius: 2,
        height: 100,
        marginTop: 5,
        flexDirection: 'column'
    },
    logo_view: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 7
    },
    logoSharedview: {
        flexDirection: 'row',
        margin: 15,
        borderTopWidth: 1,
        borderColor: '#cccccc',
        borderLeftWidth: 1,
    },
    promotion_description: {
        flexDirection: 'column',
        margin: 4,
        height: 20 * vh,
        marginTop: 2
    },
    promotion_bottom_description: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 2
    },
    promotion_bottom_location: {
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
    promotion_text_description: {
        fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 0, fontSize: 4 * vmin, color: 'black'
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
    promotion_bottomUpperContainer: {
        backgroundColor: 'white',
        width: width,
        height: 20 * vh,
        flexDirection: 'row',
        marginTop: 0,
    },
    business_bottomUpperContainer: {
        backgroundColor: 'white',
        width: width ,
        flexDirection: 'row',
        marginTop: 0,
    },
    promotion_bottomContainer: {
        backgroundColor: 'white',
        width: width ,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
        flexDirection: 'row',
        borderTopWidth:1,
        borderColor:'#cccccc'
    },
    post_bottomContainer: {
        backgroundColor: 'white',
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        borderTopWidth:1,
        borderColor:'#cccccc'
    },
    promotion_shared_bottomContainer: {
        backgroundColor: 'white',
        width: width ,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
        flexDirection: 'row',

        borderColor:'#cccccc'
    },
    promotionsSeparator: {
        backgroundColor: 'white',
        width: width,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    promotiosDescription: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 15,
    },
    promotiosShareDescription: {
        flex: 4,
        borderColor: '#cccccc',
        borderLeftWidth: 1,
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 15,
    },
    promotionDetails: {
        flex: 1.7,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        // alignItems:'flex-start',
        justifyContent: 'center',
        width: width - 15,
    },
    promotionShareDetails: {
        flex: 1.6,
        borderColor: '#cccccc',
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: width - 15,
        marginLeft: 15,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
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
    promotion_share: {
        marginLeft: 10,
        marginRight: 10,
        color: 'blue',
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
        marginBottom: 5,
        color: 'gray',
        fontSize: 16
    },
    promotion_nameText: {
        fontFamily: 'Roboto-Regular',
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
        maxWidth: width,
    },
    message_component: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 10 * vh,
        width: width,
    },
    messageName: {
        flexDirection: 'column',
    },
    dateFont: {
        fontFamily: 'Roboto-Regular', marginRight: 10, marginLeft: 10, marginTop: vh * 1, fontSize: 14, color: 'gray'
    },
    date_container: {
        width: vw * 30,
        justifyContent: 'flex-end',
        marginRight: 10,
        flexDirection: 'row',
    },
    message_container: {
        width: vw * 45,
        justifyContent: 'flex-start',
    },
    promotionDetailsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        flex: 3,
        width: width ,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promotionLoctionContainer: {
        alignItems:  'flex-start',
        flex: 2.5,
    },
    detailsTitleText: {
        marginLeft: 5,
        marginRight: 5,
        color: '#839192',
        fontSize: 14
    },
    detailsText: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expireDateContainer: {
        alignItems: 'flex-start' ,
        //marginRight: I18nManager.isRTL ? 0 : 20,
        flex: 3,
    },
    editButtonContainer: {
        flex: 2.4,
    },
};
