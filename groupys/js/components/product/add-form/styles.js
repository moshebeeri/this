import loginTheme from './add-product-theme';
const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    product_container: {
        flex: 1,
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    product_upper_container: {
        width: width,
        height: 220,
        backgroundColor: '#FA8559',
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    addCoverContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 220,
    },
    addCoverNoImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    addCoverText: {
        color: 'white', margin: 5, fontSize: 16
    },
    inputTextLayout: {
        marginTop: 4, padding: 3,
        width: width - 15
    },
    inputTextLayoutImage: {
        marginBottom: 10, padding: 3,
        width: width - 15
    },
    cmeraLogoContainer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
};
