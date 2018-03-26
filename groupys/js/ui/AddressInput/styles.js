const React = require('react-native');
import StyleUtils from '../../utils/styleUtils';

const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    inputTextLayout: {
        paddingTop:5, paddingRight: 10,paddingLeft: 10,
        width: width - 15
    },

    textInputTextStyle: {
        color: '#666666',
        fontFamily: 'Roboto-Regular',
        fontSize: StyleUtils.scale(15),
        justifyContent:   'flex-start' ,
        marginLeft:  2,
        // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom:2,

    },

};





