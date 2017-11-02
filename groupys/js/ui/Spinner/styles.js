const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    spinnerContainer: {
        alignItems:'center',
        justifyContent: 'center',
        width:width,
        height:230,
        opacity:0.8,
        flex: 1,

        backgroundColor:'white',
        position: 'absolute',
    },

};





