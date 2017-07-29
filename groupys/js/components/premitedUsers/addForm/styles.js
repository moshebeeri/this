

const React = require('react-native');


const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    premtied_usesrs_container:{
        flex:1,
        height:height,
        width:width,

        alignItems: 'center',
        padding:5,

    },
    business_upper_container:{
        width:width - 15,
        height:120,
        marginTop:3,
        marginBottom:5,

        flexDirection: 'row',
    },
    avoidView:{
        width:width -25,
        alignItems: 'center',
    },
    business_upper_image_container:{
        width:width / 3,
        height:110,
        marginTop:10,
        marginRight:12,
        marginLeft:10,
        backgroundColor:'white'
    },
    business_upper_name_container:{
        width:width / 3 + 80,
        height:90,
        marginTop:10,
        marginBottom:12,
        marginRight:12,
    },
    picker:{
        margin:3,height:50,width:width - 18
        ,backgroundColor:'white'
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



    },
    contentContainer:{
        paddingVertical: 3,
        marginRight:10,
        paddingLeft:10
    }
};
