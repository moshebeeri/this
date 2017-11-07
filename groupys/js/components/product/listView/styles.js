const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    productContainer:{
        backgroundColor:'white',
        flexDirection:'row',
        height:80,
        alignItems:'center',
        borderBottomWidth:0.3,
        borderColor:'#e6e6e6'

    },
    productImageContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',

    },
    productMainContainer:{
        flex:3,
    },
    productDescContainer:{

    },
    productPriceContainer:{

    },
    productEditContainer:{
        flex:1,
        height:80,
        alignItems:'center',
        justifyContent:'center',

    },
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
        color:'#ff6400'
    },
    retailTextStyle:{
        color:'#b3b3b3'
    }

};
