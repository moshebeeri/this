

import loginTheme from './add-business-theme';

const React = require('react-native');


const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    container:{
        flex:1,
        backgroundColor:'#f7e6ff',
        padding:10,

    },
    itemborder:{

        justifyContent: 'center',
        alignItems: 'center',
        padding:3

    },
    buttonsBorder:{

        flexDirection: 'row',
        padding:3,
        paddingLeft:25

    },
    buttons:{
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        borderBottomWidth:1,
        width:100,
        height:40,
        padding:3,
        borderRadius:10

    },
    item:{


        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        borderBottomWidth:1,
        width: width/1.2
    },
    shortItem:{


        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        borderBottomWidth:1,
        width: width/2.44
    },

    addButton:{
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:1,
        borderBottomWidth:1,
        width: width/1.2,
        height:40,
        borderRadius:10
    },
    addButtonText:{
        justifyContent:'center',
        alignItems: 'center',
        width: width/1.2,
        padding:10,
        paddingLeft:95



    }
};
