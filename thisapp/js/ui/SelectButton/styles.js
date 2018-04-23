const React = require('react-native');
const {Dimensions} = React;
import StyleUtils from '../../utils/styleUtils'

const {width, height} = Dimensions.get('window');
module.exports = {
    buttonStyle: {
        borderColor: '#FA8559',
        borderWidth: 1,
        backgroundColor: 'white',
        height: StyleUtils.scale(52),
        width: StyleUtils.scale(120),
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonClientStyle: {
        borderColor: '#2db6c8',
        borderWidth: 1,
        backgroundColor: 'white',
        height: StyleUtils.scale(52),
        width: StyleUtils.scale(120),
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyleInvalid: {
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: 'white',
        height: StyleUtils.scale(52),
        width: StyleUtils.scale(120),
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextStyle: {
        color: '#FA8559',
        fontSize: StyleUtils.scale(16)
    },
    buttonClientTextStyle: {
        color: '#2db6c8',
        fontSize: StyleUtils.scale(16)
    },
    buttonTextStyleInvalid: {
        color: 'red',
        fontSize: StyleUtils.scale(16)
    }
};





