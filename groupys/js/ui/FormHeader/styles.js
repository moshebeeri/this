const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
module.exports = {
    formHeaderBackButoon: {
        flex: 1,
        height: vh * 7,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    formHeadrTitleStyle: {
        color: "white",
        flex: 2,
        fontSize: 16,
        backgroundColor: 'transparent'
    }
};
