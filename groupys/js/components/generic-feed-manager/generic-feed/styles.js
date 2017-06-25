



const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')
module.exports = {

    button: {

        width: width,
        height: 46,
        justifyContent:'center',
        marginTop:10
    },
    buttonText: {

        paddingLeft:width/2 -20,
        fontSize:20,
        color:'white',
        justifyContent:'center'
    },
    thumbnail: {

        marginLeft:70 ,
        paddingLeft:90,
        paddingTop:90,


    },
    like: {

        marginLeft:15 ,



    },
    likeText: {

        marginTop:15 ,



    },
    buttonLike: {






    },
    buttonView:{
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 55,
    },
    image:{
        width: width, height: 300,flex:-1
    },
    imageTopText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',
        fontWeight: 'bold',marginLeft:20,marginTop:100,fontSize:25,color:'white'
    },
    imageButtomText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginLeft:20,marginTop:5,marginBottom:10,color:'white',fontSize:15
    },
    backdropView: {
        height: 300,
        width: 320,
        backgroundColor: 'rgba(0,0,0,0)',
    }



};
