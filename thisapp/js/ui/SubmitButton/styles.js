const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    submitButton: {
        flexDirection: 'column',
        justifyContent: 'center',

       minWidth:width - 20,
        height: 75,
    },

};





