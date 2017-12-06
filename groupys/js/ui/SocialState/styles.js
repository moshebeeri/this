const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        minWidth:width,
        height: 40,
    },
    promotion_iconView:{
        flexDirection: 'row',
        justifyContent: 'center',
        flex:1
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
    promotionLikeActive:{
        marginRight:5,
        marginLeft:5,
        color:'red'
    },
    promotionBusiness:{
        marginRight:5,
        marginLeft:5,

        color:'#e19c73'
    },
    promotionShareActive:{
        marginRight:5,
        marginLeft:5,

        color:'blue'
    },
    promotionFeed:{
        marginRight:5,
        marginLeft:5,

        color:'#2db6c8'
    },

    promotionDisabledFeed:{
        marginRight:5,
        marginLeft:5,

        color:'#cccccc'
    },

    socialTextColor:{
        color:'#898989'
    }
};




