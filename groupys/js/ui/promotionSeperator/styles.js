const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    seperatorContainer: {
        alignItems:'center',
        justifyContent: 'space-between',

        height:20,
        flexDirection:'row',
        flex: 1,
        width:width - 30,

        backgroundColor:'white',
        position: 'absolute',
    },
    roundView:{

        height:6,
        width:6,
        borderRadius:6,
        backgroundColor:'#b7b7b7'
    },
    triangleLeft: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#b7b7b7',
        transform: [
            {rotate: '-90deg'}
        ]
    },
    triangleRight: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#b7b7b7',
        transform: [
            {rotate: '90deg'}
        ]
    },


};





