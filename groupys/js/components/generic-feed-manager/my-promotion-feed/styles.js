



const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')
module.exports = {

    button: {

        width: width,
        height: 46,
        justifyContent:'center',
        marginTop:0
    },
    buttonText: {

        paddingLeft:width/2 -30,
        fontSize:20,
        color:'white',
        justifyContent:'center'
    },
    buttonView:{
        flex:-1,justifyContent:'center',flexDirection: 'row'
    },
    image:{
        width: width, height: 300,flex:-1
    },
    imageTopText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',
        fontWeight: 'bold',marginLeft:20,marginTop:170,fontSize:25,color:'white'
    },
    imageButtomText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginLeft:20,marginTop:5,color:'white',fontSize:15
    }



};
