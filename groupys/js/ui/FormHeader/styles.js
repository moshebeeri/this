const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
module.exports = {
    formHeaderBackButoon: {
        flex: 1,

        height:  (Platform.OS === 'ios') ? vh * 6 : vh * 7,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    formHeaderSubmitButoon: {
        flex: 1,
        height:  (Platform.OS === 'ios') ? vh * 6 : vh * 7,
        paddingRight:(Platform.OS === 'ios') ? 7 : 0,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    formHeadrTitleStyle: {
        color: "white",
        fontSize: 16,
        backgroundColor: 'transparent'
    }
};
