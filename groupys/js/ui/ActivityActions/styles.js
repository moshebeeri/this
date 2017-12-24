const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    imagePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',


    },

    showFeedBackContainer:{
        width:width,
        height:200,
        opacity:1,
        flex: 1,
        position:'absolute',
        bottom:0,
        right:0,
        backgroundColor:'white'
    }
};





