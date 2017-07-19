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

    }

};
