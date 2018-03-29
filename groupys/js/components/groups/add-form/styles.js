const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
import StyleUtils from '../../../utils/styleUtils'
module.exports = {
    product_container: {
        flex: 1,
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    product_upper_container: {
        width: width,
        height: StyleUtils.relativeHeight(30,30),
        backgroundColor: '#2db6c8',
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    addCoverContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 220,
    },
    addCoverNoImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    addCoverText: {
        color: 'white', margin: 5, fontSize: StyleUtils.scale(16)
    },
    textInputTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: StyleUtils.scale(16),
        justifyContent:   'flex-start' ,
        marginLeft:  8,
        // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom:5,

    },
    inputTextLayour: {
        marginTop: 4, padding: 3,
        width: width - 15
    },
    inputTextLayourImage: {
        marginBottom: 10, padding: 3,
        width: width - 15
    },
    cmeraLogoContainer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupSelectUserContainer: {
       marginTop:10,
        marginBottom:10,
        width: width - 15, flexDirection: 'row', flex: 1.7, justifyContent: 'flex-start', alignItems: 'center'
    }
};
