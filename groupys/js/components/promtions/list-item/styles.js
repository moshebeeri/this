const React = require('react-native');
import StyleUtils from '../../../utils/styleUtils';

const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    promotion_container: {
        borderColor: '#e7e7e7',
        backgroundColor: 'white',
        borderTopWidth: 5,
    },
    promotionHeader: {
        backgroundColor: 'white',
        flex: 3,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    promotionPunchHeader: {
        backgroundColor: 'white',
        flex: 3,
        width: width,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    promotionValue: {
        flex: 1,
        margin: 5,
        alignItems: 'flex-start',
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    promotionPunchValue: {
        flex: 1,
        margin: 5,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    promotiontDescription: {
        flex: 3.5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 20,
        color: '#e65100'
    },
    titleValue: {
        fontSize: 40,
        color: '#e65100'
    },
    XplusYtitleValue: {
        fontSize: 30,
        color: '#e65100'
    },
    puncCardtitleValue: {
        fontSize: 16,
        color: '#e65100'
    },
    promotionImageContainer: {
        width: width,
        flex: 1,
        backgroundColor: 'white',
        height: StyleUtils.relativeHeight(40, 40),
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
    },
    promotionDetailsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    promotionLoctionContainer: {
        alignItems: 'flex-start',
        backgroundColor: 'white',
        marginLeft: 20,
    },
    expireDateContainer: {
        alignItems: 'flex-start',
        backgroundColor: 'white',
        marginLeft : StyleUtils.scale(30)
    },
    editButtonContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        marginRight: 20,
        justifyContent: 'center',
    },
    detailsTitleText: {
        marginLeft: 5,
        marginRight: 5,
        color: '#839192',
        fontSize: StyleUtils.scale(14)
    },
    detailsTitleSavedText: {
        marginRight: StyleUtils.scale(20),

        color: '#839192',
        fontSize: StyleUtils.scale(14)
    },
    detailsText: {
        marginLeft: 5,
        fontSize: StyleUtils.scale(14),
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promotionAnalyticsContainer: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#b3b3b3',
    },
    promotionAnalyticsAttribute: {
        width: StyleUtils.scale(90),
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: StyleUtils.scale(25),
        alignItems: 'center',
    },
    promotionTotalsAttribute: {
        justifyContent: 'center',
        width: StyleUtils.scale(100),
        marginLeft: StyleUtils.scale(5),
        alignItems: 'center',
    },
    promotionSavedsAttribute: {
        justifyContent: 'center',
        width: StyleUtils.scale(100),
        alignItems: 'center',

    },
    promotion_addressText: {
        color: '#e65100',
        fontSize: StyleUtils.scale(20)
    },
    promotion_addressText_saved: {
        color: '#e65100',
        fontSize: StyleUtils.scale(20),
        marginRight: StyleUtils.scale(20),

    },
    promotion_card: {}
};
