const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        borderTopWidth:0.3,
        borderColor:'#b3b3b3',
        minWidth:width,
        height: 40,
    },
    promotion_iconView:{
        flexDirection: 'row',
        justifyContent: 'center',
        flex:1
    },
    promotion_like:{
        marginRight:5,
        marginLeft:5,
        color:'#e19c73'
    },
    promotion_comment:{
        marginRight:5,
        marginLeft:5,

        color:'#e19c73'
    },
    promotion_unlike:{
        marginRight:5,
        marginLeft:5,

        color:'#e19c73'
    },
    promotion_share:{
        marginRight:5,
        marginLeft:5,
        color:'#e19c73'
    },
    socialTextColor:{
        color:'#898989'
    }
};





