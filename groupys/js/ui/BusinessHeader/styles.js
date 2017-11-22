const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
module.exports = {
    logo_view: {
        flexDirection: 'row',
        backgroundColor:'white',
    },
    businessNameText: {
        fontFamily: 'Roboto-Black',
        fontWeight: 'bold',

        marginLeft:5,
        fontSize: 18,

    },
    businessAddressText: {
        fontFamily: 'Roboto-Regular',

        marginLeft:5,
        color: 'gray',
        fontSize: 16
    },

};
