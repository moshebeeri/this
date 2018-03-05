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
        width:width,

        backgroundColor:'white',
        position: 'absolute',
    },
    roundView:{

        height:8,
        width:8,
        borderRadius:8,
        backgroundColor:'#b7b7b7',


        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 1,
        // background color must be set
        backgroundColor : "#b7b7b7", // invisible color






        //borderWidth: 1,
        //borderColor: '#555555',
        //borderBottomStyle: 'solid',
        //borderBottomColor:'#000000',
        //borderBottomWidth:1,
        //boxShadow:'inset 0px 0px 2px rgba(50,50,50,.3)'
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





