



const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')

const   vw = width/100;
const  vh = height/100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
module.exports = {

    button: {

        width: vmin * 100,
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

    promotion_container: {
        flex: 1,
        height: 81 *vh,
        width: width ,
        overflow: 'hidden',
        backgroundColor:'#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',





    },
   bussiness_container: {
        flex: 1,
        height: vh*61,
        width: width ,
        overflow: 'hidden',
        backgroundColor:'#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',





    },
    Welcome_container: {
        flex: 1,
        height: 18 * vh,
        width: width ,
        overflow: 'hidden',
        backgroundColor:'#b7b7b7',
        // backgroundColor:'#FFF',
        alignItems: 'center',
        flexDirection: 'column',





    },
    promotion_card:{
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor:'#b7b7b7',
        width: width,


        borderRadius:2,

    },
    promotion_image:{
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined

    },
    promotion_image_view:{
        width: width,height: vh*36,
    },
    promotion_upperContainer: {

        backgroundColor:'white',
        width: width,
        borderRadius:2,
        height: 18 *vh,
        flexDirection: 'column'

    },
    bussiness_upperContainer: {

        backgroundColor:'white',
        width: width,
        borderRadius:2,
        height: vh*7,
        flexDirection: 'column'

    },
    welcome_upperContainer: {

        backgroundColor:'white',
        width: width,
        borderRadius:2,
        height: 100,
        marginTop:5,
        flexDirection: 'column'

    },
    logo_view:{
        flexDirection: 'row',
        marginLeft:10,
        marginTop:7
    },

    promotion_description:{
        flexDirection: 'column',
        margin:4,
        height: 20 *vh,
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
        fontFamily:'Roboto-Regular', marginLeft:10,marginTop:0,fontSize:4 *vmin,color:'black'
    },
    promotion_buttonText: {
        paddingTop:10 ,
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
        flex:-1,justifyContent:'center',flexDirection: 'row',height: 40,width:100
    },

    promotion_buttomUpperContainer: {
        backgroundColor:'white',
        width: width ,
        height: 20 *vh,
        flexDirection: 'row',
        marginTop:0,
    },
    business_buttomUpperContainer: {
        backgroundColor:'white',
        width: width ,
        height: vh*12,
        flexDirection: 'row',
        marginTop:0,
    },
    promotion_bottomContainer: {

        backgroundColor:'white',
        width: width ,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: vh*6,
        flexDirection: 'row',
        marginTop:0,
        borderWidth:1,
        borderColor:'#e0e0eb',

    },

        promotion_like: {

        marginLeft:10 ,
        marginRight:10 ,
        color:'red',


    },
    promotion_unlike: {

        marginLeft:10 ,
        marginRight:10 ,



    },

    promotion_share: {

        marginLeft:10 ,
        marginRight:10 ,
        color:'blue',


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
        fontFamily:'Roboto-Regular',marginRight:20,marginLeft:10,marginTop:0,marginBottom:5,color:'gray',fontSize:16
    },
    promotion_nameText:{
        fontFamily:'Roboto-Black',fontWeight: 'bold',marginRight:20,marginLeft:10,marginTop:5,marginBottom:5,color:'black',fontSize:18
    },

    messageContainer:{
        flexDirection: 'row',
        margin:2,
        borderWidth:0,
        maxWidth:width,

    },
    message_component:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 10 *vh,
        width:width,

    },
    messageName:{

        flexDirection: 'column',

    },
    dateFont:{
        fontFamily:'Roboto-Regular',  marginRight: 10,marginLeft:10,marginTop:vh*1,fontSize:14,color:'gray'

    },
    date_container:{
        width:vw*30,
        justifyContent: 'flex-end',
        marginRight:10,

        flexDirection: 'row',
    },
    message_container:{
        width:vw*45,
        justifyContent: 'flex-start',
    }


};
