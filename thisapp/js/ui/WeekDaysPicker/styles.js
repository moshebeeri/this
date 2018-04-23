const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
import StyleUtils from '../../utils/styleUtils'
module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 250,
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 55,
    },
    checkboxContainerStyle: {
        marginTop: 3,
    },
    textInputComponentLayout: {
        width: width - 20,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    textInputComponentInvalidLayout: {
        width: width - 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'red'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        borderRadius: 2,
        fontSize: StyleUtils.scale(16),
    },
    textInputInvalidComponentStyle: {
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
        borderRadius: 2,
        fontSize: StyleUtils.scale(16),
        borderWidth: 1,
        borderColor: 'red'
    },
    textInputTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    textInputTextStyle: {
        color: '#666666',
        fontFamily: 'Roboto-Regular',
        fontSize: StyleUtils.scale(15),
        justifyContent: 'flex-start',
        marginLeft: 2,
        // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom: 2,
    },
    textInputTextStyleWhite: {
        color: 'white',
        fontFamily: 'Roboto-Regular',
        fontSize: StyleUtils.scale(16),
        marginLeft: 10,
    }
};





