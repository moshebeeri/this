const React = require('react-native');
const {Dimensions} = React;
import StyleUtils from "../../utils/styleUtils";

module.exports = {
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor:'white',
        marginTop:5,
        marginBottom:5,
    },
    promotion_iconView: {
        marginRight:StyleUtils.scale(20),
        marginLeft:StyleUtils.scale(20),

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'white',
        height:StyleUtils.scale(40)
    },
    promotion_like: {
        marginRight: 5,
        marginLeft: 5,
        color: '#e19c73'
    },
    promotionLikeActive: {
        marginRight: 5,
        marginLeft: 5,
        color: 'red'
    },
    promotionBusiness: {
        marginRight: 5,
        marginLeft: 5,
        color: '#e19c73'
    },
    promotionShareActive: {
        marginRight: 5,
        marginLeft: 5,
        color: '#068da5'
    },
    promotionFeed: {
        marginRight: 5,
        marginLeft: 5,
        color: '#2db6c8'
    },
    promotionDisabledFeed: {
        marginRight: 5,
        marginLeft: 5,
        color: '#cccccc'
    },
    socialTextColor: {
        color: '#898989',
        fontSize: StyleUtils.scale(16)
    }
};





