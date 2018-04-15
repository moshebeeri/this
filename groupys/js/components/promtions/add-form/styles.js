const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
import {I18nManager} from 'react-native';
import StyleUtils from '../../../utils/styleUtils'
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
        height: StyleUtils.getWidth() * 9 /16,
        backgroundColor: '#FA8559',
        marginBottom: 4,
       paddingTop:10,
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
        color: 'white', margin: 5, fontSize: StyleUtils.scale(16)
    },
    textLayout: {
        marginTop: 4,
        justifyContent:  'flex-start' ,
        alignItems: 'flex-start',
        width: width - 15
    },
    inputTextMediumLayout: {
        marginTop: 4, padding: 3,
        flexDirection: 'row',
        width: width - 15
    },
    inputTextLayoutImage: {
        marginBottom: 10, padding: 3,
        width: width - 15
    },

    inputTextLayout: {
        paddingTop:10, paddingRight:5 ,paddingLeft: 5,
        width: width - 15
    },
    conditionForm:{
        paddingTop:10,paddingRight: 5,paddingLeft: 5,
        width: width - 15
    },
    cmeraLogoContainer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
};
