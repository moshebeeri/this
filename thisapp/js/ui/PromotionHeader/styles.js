const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
import StyleUtils from '../../utils/styleUtils'

module.exports = {
    promotion_container: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        borderTopWidth: 2,
    },
    promotionHeader: {
        flex: 1,
        width: width - 15,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    promotionHeaderColumn: {
        flex: 1,
        width: width - 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promotionPunchHeader: {
        backgroundColor: 'white',
        flex: 3,
        width: width - 15,
    },
    promotionValue: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingTop: 7, //need to find a way to verticly align @yb
    },
    promotionColumnValue: {
        flex: 1,
    },
    promotionPunchValue: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    promotiontDescription: {
        flex: 3,
        margin: 4,
        paddingLeft: 5,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    promotiontColumnDescription: {
        flex: 1,
    },
    promotiontHappyDescription: {
        flex: 3,
        margin: 4,
        justifyContent: 'flex-start'
    },
    titleText: {
        fontSize: StyleUtils.scale(20),
        color: '#e65100'
    },
    titleValue: {
        fontSize: StyleUtils.scale(40),
        width: StyleUtils.scale(100),
        textAlign: "center",
        color: '#e65100',
    },
    XplusYtitleValue: {
        fontSize: StyleUtils.scale(30),
        color: '#e65100'
    },
    puncCardtitleValue: {
        fontSize: StyleUtils.scale(16),
        color: '#e65100'
    },
    titleTextFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(20),
        color: '#2db6c8'
    },
    titleTextColumnFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(25),
        color: '#2db6c8',
    },
    titleFeedHappyTextFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(15),
        color: '#2db6c8'
    },
    titleHappyTextFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(15),
        color: '#e65100'
    },
    titleValueFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(30),
        textAlign: "center",
        color: '#2db6c8',
    },
    titleValueColumnFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(50),
        color: '#2db6c8',
    },
    XplusYtitleValueFeed: {
        fontSize: StyleUtils.scale(30),
        color: '#2db6c8'
    },
    puncCardtitleValueFeed: {
        flex: 1,
        fontSize: StyleUtils.scale(18),
        color: '#2db6c8'
    },
    promotionImageContainer: {
        width: width,
        flex: 1,
        backgroundColor: 'white',
        height: 220,
    },
    promotionInformation: {
        width: width - 25,
        marginBottom: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    promotion_image: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    promotionInfoTextI: {
        fontSize: StyleUtils.scale(16),
        marginLeft: 5,
        marginRight: 5,
    },
    promotionTermlTextStyle: {
        color: '#839192',
        flex: 1,
        fontSize: StyleUtils.scale(13),
        alignItems: 'flex-end'
    },
    promotionColumnTermlTextStyle: {
        color: '#839192',
        flex: 1,
        fontSize: StyleUtils.scale(13),
    },
    promotionDetailsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: StyleUtils.scale(55)
    },
    promotionLoctionContainer: {
        alignItems: 'flex-start',
        flex: 2.5,
    },
    expireDateContainer: {
        alignItems: 'flex-start',
        flex: 3,
    },
    editButtonContainer: {
        flex: 2.4,
    },
    detailsTitleText: {
        marginLeft: 5,
        marginRight: 5,
        color: '#839192',
        fontSize: StyleUtils.scale(14)
    },
    detailsText: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promotionAnalyticsContainer: {
        flexDirection: 'row',
        width: width,
        height: StyleUtils.scale(55),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.3,
        borderColor: '#b3b3b3',
    },
    promotionAnalyticsAttribute: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    promotion_addressText: {
        color: '#e65100',
        fontSize: StyleUtils.scale(20)
    },
    promotion_card: {
        margin: 5
    }
};
