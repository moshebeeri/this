const React = require('react-native');
const {Dimensions} = React;
import StyleUtils from "../../utils/styleUtils";
module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 85,
    },
    textInputNoFiledContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 50,
    },
    textInputComponentLayout: {
        flexDirection: 'row'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        fontSize: StyleUtils.scale(14),
        borderRadius: 2,
    },
    textInputInvalidComponentStyle: {
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
        fontSize: StyleUtils.scale(14),
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'red'
    },
    textInputTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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





