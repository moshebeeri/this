

const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')
const   vw = width/100;
const  vh = height/100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
module.exports = {
    group_container:{
        width :width  ,
        height: vh*17,
        alignItems:'center',
        marginBottom: 4,

        backgroundColor:'white'

    },
    group_description:{
        width :width  ,
        height: vh*15,
        flexDirection: 'row',
        borderWidth: 0,
        justifyContent: 'space-between',
    },
    group_content:{
        width :width  -10,
        height: 40,
        flexDirection: 'column',
        borderWidth: 0,
    },

    group_messages:{
        width :(width -10),
        height: 40,
        flexDirection: 'row',
        borderWidth: 0,
        borderTopWidth:0.5,
        borderTopColor:'#dbdbdb',
        borderRightWidth:1
    },
    group_promotion:{
        width :(width -10),
        height: 60,
        flexDirection: 'row',
        borderTopColor:'#dbdbdb',
        borderTopWidth:1,

    },
    group_image:{
        marginTop:10,
        marginLeft:10
    },
    group_name:{
        marginTop:10,
        width:vw*50,
    },
    group_name_text:{
        fontFamily:'Roboto-Regular',fontWeight: 'bold',  marginLeft:10,marginTop:0,fontSize:24,color:'black'
    },
    group_members:{
        fontFamily:'Roboto-Regular',  marginLeft:10,marginTop:5,fontSize:16,color:'black'

    },
    dateFont:{
        fontFamily:'Roboto-Regular',  marginRight: 10,marginLeft:10,marginTop:vh*3,fontSize:14,color:'gray'

    },
    date_container:{
        width:vw*30,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    }

};
