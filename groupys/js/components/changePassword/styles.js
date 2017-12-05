const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    inputTextLayout: {
        marginTop: 4, padding: 3,
        width: width - 15
    },
    inputTextLayoutImage: {
        marginBottom: 10, padding: 3,
        width: width - 15
    },
    settingsContainer: {},
    thumbnail: {
        alignItems:'center',
        justifyContent:'center',
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.4,
        shadowRadius: 1,

        width: width,
        height: 150,
    },
};
