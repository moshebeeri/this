const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const deviceHeight = Dimensions.get('window').height;
export default {
    camera: {
        height: Dimensions.get('window').height * 0.6,
        width: Dimensions.get('window').width
    },
};
