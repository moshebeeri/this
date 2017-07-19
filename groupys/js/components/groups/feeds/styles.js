import loginTheme from './general-theme';

const React = require('react-native');

const {StyleSheet,Dimensions, Platform} = React;

const {width, height} = Dimensions.get('window')
module.exports = {
    itemborder:{

        justifyContent: 'center',
        alignItems: 'center',
        padding:3,

    },

    item:{

        backgroundColor:'white',
        borderColor:'black',


        width: width/1.4
    },

    icon:{

        backgroundColor:'white',
        borderColor:'black',

        justifyContent: 'center',
        alignItems: 'center',



    },
    headerContainer:{
        flexDirection: 'row',
        width: width,
        height:70,
        backgroundColor:'#fff'
    },
    imageStyle:{
        marginTop:7
    },

    group_name_text:{
        fontFamily:'Roboto-Regular',fontWeight: 'bold',  marginLeft:10,marginTop:5,fontSize:24,color:'black'
    },
    group_members:{
        fontFamily:'Roboto-Regular',  marginLeft:10,marginTop:5,fontSize:16,color:'black'

    },

    headerTabContainer:{
        height:50,
        width: width,
        backgroundColor:'#d7d7d7',
        flexDirection: 'column',
        alignItems:'center',
    },
    headerTabInnerContainer:{
        flexDirection: 'row',
    },
    promotionTab:{
        height:40,
        width:120,
        marginTop:5,
        backgroundColor:'#d7d7d7',
        borderWidth:2,
        borderColor:'#bfbfbf',
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,
        alignItems:'center',
    },
    chatTab:{
        height:40,
        width:120,
        marginTop:5,
        backgroundColor:'#2db6c8',
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
        alignItems:'center',

    },
    group_promotion_text:{
        fontFamily:'Roboto-Regular',  marginLeft:0,marginTop:5,fontSize:18,color:'#595959'
    },
    group_chat_text:{
        fontFamily:'Roboto-Regular',  marginLeft:0,marginTop:5,fontSize:18,color:'white'
    },


};
