const React = require('react-native');
import StyleUtils from '../../../utils/styleUtils';

const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    promotion_container: {
        borderColor: '#e7e7e7',
        alignItems:'center',
        justifyContent:'center',

    },
    bannerImageContainer:{
        flex: -1,
        alignSelf: 'center',
        alignItems:'flex-end',
        height:  StyleUtils.getWidth() * 9 / 16,

        width: width,
    },

};
