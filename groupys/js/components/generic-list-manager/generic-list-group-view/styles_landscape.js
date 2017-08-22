

const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const {width, height} = Dimensions.get('window')

module.exports = {
    group_container:{
        width :height -10 ,
        height: 130,
        alignItems:'center',
        borderWidth: 1,
        margin: 5,
        backgroundColor:'white'

    },
    group_description:{
        width :height  -10,
        height: 100,
        flexDirection: 'row',
        borderWidth: 0,
    },
    group_content:{
        width :height  -10,
        height: 40,
        flexDirection: 'column',
        borderWidth: 0,
    },

    group_messages:{
        width :(height -10),
        height: 40,
        flexDirection: 'row',
        borderWidth: 0,
        borderTopWidth:0.5,
        borderTopColor:'#dbdbdb',
        borderRightWidth:1
    },
    group_promotion:{
        width :(height -10),
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
    },
    group_name_text:{
        fontFamily:'Roboto-Regular',fontWeight: 'bold',  marginLeft:10,marginTop:5,fontSize:24,color:'black'
    },
    group_members:{
        fontFamily:'Roboto-Regular',  marginLeft:10,marginTop:5,fontSize:16,color:'black'

    }

};
