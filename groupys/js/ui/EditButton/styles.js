const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {

    editButtonConntainer:{
        borderRadius:30,
        height:30,
        width:30,
        borderColor:'#ff6400',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
    },
    productIcon:{
        color:'white'
    },
    retailTextStyle:{
        color:'#b3b3b3'
    }

};
