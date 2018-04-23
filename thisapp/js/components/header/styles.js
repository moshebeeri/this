const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
module.exports = {
    header: {
        flexDirection: 'column',
        marginTop: 5,
        backgroundColor: "white",
        height: vh * 7
    },
    button: {
        backgroundColor: 'transparent'
    }
};
