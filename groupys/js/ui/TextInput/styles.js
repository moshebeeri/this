const React = require('react-native');
import StyleUtils from '../../utils/styleUtils';

module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: StyleUtils.scale(70),
    },
    textAreaContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: StyleUtils.scale(150),
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: StyleUtils.scale(55),
    },
    textInputComponentLayout: {
        flexDirection: 'row',
        flex: 1,
    },
    textInputComponentStyle: {
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flex: 1,
        padding: 10,
        borderRadius: 2,
        fontSize: StyleUtils.scale(16),
    },
    textInputDisabledComponentStyle: {
        backgroundColor: '#CACFD2',
        justifyContent: 'flex-start',
        flex: 1,
        padding: 10,
        borderRadius: 2,
    },
    textInputInvalidComponentStyle: {
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
        borderRadius: 2,
        justifyContent: 'flex-start',
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
        justifyContent: 'flex-start',
        fontFamily: 'Roboto-Regular',
        fontSize: StyleUtils.scale(16),
        marginLeft: 10,
    }
};





