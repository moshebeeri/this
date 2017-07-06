



const React = require('react-native');

const { StyleSheet,Dimensions, Platform } = React;
const {width, height} = Dimensions.get('window')
module.exports = {

    productIcon: {

        marginLeft:1 ,
        marginRight:3 ,


    },
    imageTopText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',
        fontWeight: 'bold',marginLeft:20,marginTop:-100,fontSize:25,color:'white'
    },
    imageButtomText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginLeft:20,marginTop:-100,marginBottom:10,color:'white',fontSize:15
    },
    container: {
        flex: 1,
        height: 270,
        overflow: 'hidden',

        alignItems: 'center',


    },
    image:{
        width: width +150,
        height: 250,
        borderBottomLeftRadius: 250, borderBottomRightRadius: 250,
        borderBottomWidth:200,
        bottom: 20,

    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },


    oval: {
        width: width +150,
        height: 250,
        borderBottomLeftRadius: 250, borderBottomRightRadius: 250,
        borderBottomWidth:200,
        bottom: 20,
        backgroundColor: 'red',

    },



    img: {
        width: Dimensions.get('window').width,
    },
    tvscreen: {},
    tvscreenMain: {
        width: 150,
        height: 75,
        backgroundColor: 'blue',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    tvscreenTop: {
        width: 73,
        height: 70,
        backgroundColor: 'blue',
        position: 'absolute',
        top: -26,
        left: 39,
        borderRadius: 35,
        transform: [
            {scaleX: 2},
            {scaleY: .5}
        ]
    },
    tvscreenBottom: {
        width: 73,
        height: 70,
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: -26,
        left: 39,
        borderRadius: 35,
        transform: [
            {scaleX: 2},
            {scaleY: .5}
        ]
    },
    tvscreenLeft: {
        width: 20,
        height: 38,
        backgroundColor: 'blue',
        position: 'absolute',
        left: -7,
        top: 18,
        borderRadius: 35,
        transform: [
            {scaleX: .5},
            {scaleY: 2},
        ]
    },
    tvscreenRight: {
        width: 20,
        height: 38,
        backgroundColor: 'blue',
        position: 'absolute',
        right: -7,
        top: 18,
        borderRadius: 35,
        transform: [
            {scaleX: .5},
            {scaleY: 2},
        ]
    },
};
