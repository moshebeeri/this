



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
    },
    promotion_backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        marginTop:110,
        backgroundColor:'black',
        width: width,
        height: 200,
    },
    promotion_container: {
        flex: 1,
        height: 470,
        overflow: 'hidden',
        backgroundColor:'#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',

        padding:10



    },
    promotion_image:{
        width: width, height: 200,flex:-1,   borderWidth: 1, alignSelf: 'flex-start',
    },
    promotion_upperContainer: {

        backgroundColor:'white',
        width: width ,
        height: 100,
        flexDirection: 'column'

    },
    logo_view:{
        flexDirection: 'row',
        marginLeft:10,
        marginTop:10
    },

    promotion_description:{
        flexDirection: 'row',
        marginLeft:10,
        marginTop:2
    },

    promotion_buttom_description:{
        flexDirection: 'column',
        marginLeft:10,
        marginTop:2
    },

    promotion_buttom_location:{
        flexDirection: 'row',

        marginTop:5
    },


    promotion_backdropView: {
        height: 200,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    promotion_type:{
        fontFamily:'Roboto-Regular',fontWeight: 'bold',  marginLeft:10,marginTop:5,fontSize:18,color:'black'
    },
    promotion_text_description:{
        fontFamily:'Roboto-Regular',  marginLeft:10,marginTop:0,fontSize:14,color:'black'
    },
    promotion_buttonText: {
        paddingTop:10,
        paddingLeft:0,
        fontSize:20,
        color:'white',
        justifyContent:'center',
        fontFamily:'Roboto-Regular'


    },
    promotion_buttonView:{
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 50, width: width ,backgroundColor:'#363636'
    },

    promotion_iconView:{
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 40,width:80
    },

    promotion_buttomUpperContainer: {
        backgroundColor:'white',
        width: width ,
        height: 120,
        flexDirection: 'row',
        marginTop:200,
    },
    promotion_bottomContainer: {

        backgroundColor:'white',
        width: width ,
        height: 40,
        flexDirection: 'row',
        marginTop:0,
        borderWidth:1,
        borderColor:'#e0e0eb'
    },

        promotion_like: {

        marginLeft:10 ,
        marginRight:10 ,
        color:'red',


    },
    promotion_location: {

        marginLeft:10 ,
        marginRight:0 ,



    },
    promotion_comment: {

        marginLeft:10 ,
        marginRight:10 ,



    },

    promotion_addressText:{
        fontFamily:'Roboto-Regular',marginRight:20,marginLeft:10,marginTop:0,marginBottom:5,color:'gray',fontSize:18
    },
    promotion_nameText:{
        fontFamily:'Roboto-Black',fontWeight: 'bold',marginRight:20,marginLeft:10,marginTop:5,marginBottom:5,color:'black',fontSize:18
    },



};
