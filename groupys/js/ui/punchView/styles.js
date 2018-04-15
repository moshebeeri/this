const React = require('react-native');
import styleUtils from '../../utils/styleUtils'

module.exports = {
    punch: {
        width: styleUtils.scale(50),
        height: styleUtils.scale(50),
        backgroundColor: '#ffffff99',
        borderRadius: styleUtils.scale(40),
        borderWidth: 1,

        borderColor: '#0000004d',
        marginRight: styleUtils.scale(10),
        marginLeft: styleUtils.scale(10),
        alignItems:'center',justifyContent:'center',
    },
    punchFeed: {
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 40,
        borderWidth: 1,

        borderColor: '#2db6c8',
        marginRight: 10,
        marginLeft: 10,
        alignItems:'center',justifyContent:'center',
    },
    punchFeedFull: {
        width: styleUtils.scale(50),
        height: styleUtils.scale(50),
        borderRadius: styleUtils.scale(40),
        marginRight: styleUtils.scale(10),
        marginLeft: styleUtils.scale(10),
    },
    container: {
        flexDirection: 'row',
        height: 30,
        marginTop: styleUtils.scale(30),
        alignItems: 'center',
        justifyContent: 'center',
    }
};





