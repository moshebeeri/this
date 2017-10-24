const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');

module.exports = {
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 80
    },
    textInputComponentLayout: {
        flexDirection: 'row'
    },
    textInputComponentStyle: {
        backgroundColor: 'white',
        flex: 1.5
    },
    textInputTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 5,
        flex: 2,
    }
};





