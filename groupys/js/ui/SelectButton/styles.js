const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    buttonStyle: {
        borderColor: '#FA8559',
        borderWidth:1,
        backgroundColor:'white',
        height:52,
        width:120,
        marginLeft:5,
        marginRight:5,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonTextStyle:{
        color:'#FA8559',
        fontSize:16
    }


};





