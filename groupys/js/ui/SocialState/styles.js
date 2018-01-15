const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        minWidth: width,
        backgroundColor:'white',
        height: 40,
    },
    promotion_iconView: {
        marginRight:20,
        marginLeft:20,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'white',
        height:30
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
        color: '#898989'
    }
};





