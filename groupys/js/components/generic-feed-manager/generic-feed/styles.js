



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
        marginRight:5 ,


    },
    likeText: {

        marginTop:15 ,



    },
    buttonLike: {






    },
    buttonView:{
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 55,
    },
    iconView:{
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 30,
    },
    image:{
        width: width-50, height: 300,flex:-1,  borderBottomLeftRadius: 15, borderTopLeftRadius: 15, borderWidth: 1, alignSelf: 'flex-start',
    },
    imageLogoName:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',
            fontWeight: 'bold',marginLeft:2,fontSize:18,color:'white'
    },
    imageTopText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',
        fontWeight: 'bold',marginLeft:20,marginTop:5,fontSize:20,color:'white'
    },
    imageButtomText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginRight:20,marginLeft:-50,marginTop:20,marginBottom:10,color:'white',fontSize:15
    },
    addressText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginRight:20,marginLeft:10,marginTop:15,marginBottom:15,color:'white',fontSize:15
    },
    backdropView: {
        height: 300,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
    },


    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
        height: 300,
        overflow: 'hidden',
        backgroundColor:'#ba5133',
        alignItems: 'center',
        borderRadius:15


    },
    overlay: {
        opacity: 0.5,

    },
    logo: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: 160,
        height: 52
    },
    backdrop: {
        flex:1,
        flexDirection: 'column'
    },
    headline: {
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white'
    }



};
