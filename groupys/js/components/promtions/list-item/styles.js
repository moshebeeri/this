const React = require('react-native');
const {StyleSheet, Platform, Dimensions} = React;
const {width, height} = Dimensions.get('window')
module.exports = {

    promotion_container:{
        borderWidth:1,
        borderColor:'#e6e6e6',
        backgroundColor:'white'
    },
    promotionHeader:{
        backgroundColor:'white',
        flex:3,
        width: width,
        alignItems:'center',
        justifyContent:'center',

        flexDirection: 'row',
    },
    promotionValue:{
        flex:1,
        margin:5,
        alignItems:'flex-start',
        justifyContent:'center',
    },
    promotiontDescription:{
        flex:3.5,
        alignItems:'flex-start',
        justifyContent:'center',
    },
    titleText:{
        fontSize:20,
        color:'#e65100'
    },
    titleValue:{
        fontSize:40,
        color:'#e65100'
    },
    promotionImageContainer:{
        width: width,
        flex:1,
        backgroundColor:'white',
        height:220,
    },
    promotionInformation:{
        width: width -25,
        marginBottom:10,
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'white',
        flexDirection:'row'
    },
    promotion_image:{
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    promotionInfoTextI:{
        fonstSize:20,
        marginLeft:5,
        marginRight:5,
    },
    promotionTermlTextStyle:{
        color:'#b3b3b3'
    },
    promotionDetailsContainer:{
        flexDirection:'row',
        backgroundColor:'white',
        height:55
    },
    promotionLoctionContainer:{
        alignItems:'flex-start',

        flex:2.5,
    },
    expireDateContainer:{
        alignItems:'flex-start',

        flex:3,
    },
    editButtonContainer:{
        flex:2.4,
    },
    detailsTitleText:{
        marginLeft:5,
        marginRight:5,

        color:'#b3b3b3',
        fontSize:14
    },
    detailsText:{
        marginLeft:5,
        marginRight:5,
        justifyContent:'center',
        alignItems:'center',

    },
    promotionAnalyticsContainer:{
        flexDirection:'row',
        width:width,
        height:55,
        justifyContent:'center',
        alignItems:'center',
        borderTopWidth:0.3,
        borderColor:'#b3b3b3',
    },
    promotionAnalyticsAttribute:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',

    },
    promotion_addressText:{
        color:'#e65100'
    }
};
