const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    productIcon: {
        marginLeft: 1,
        marginRight: 3,
        fontSize: 25,
    },
    imageTopText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold', marginLeft: 20, marginTop: -100, fontSize: 25, color: 'white'
    },
    imageBottomText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: -100,
        marginBottom: 10,
        color: 'white',
        fontSize: 15
    },
    container: {
        flex: 1,
        height: 270,
        overflow: 'hidden',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: 250,
        top: 10,
        bottom: 20,
    },
    imageb: {
        width: width,
        height: 70,
        top: 180,
        bottom: 20,
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    oval: {
        width: width + 150,
        height: 250,
        borderBottomLeftRadius: 250, borderBottomRightRadius: 250,
        borderBottomWidth: 200,
        bottom: 20,
        backgroundColor: 'red',
    },
    img: {
        width: Dimensions.get('window').width,
    },
    follow_container: {
        height: height,
        width:width,
    },
    follow_search: {
        height: 50,
        marginBottom: 6, backgroundColor: 'white'
    },
    follow_search_field: {
        marginRight: 20, backgroundColor: 'white'
    },
    payment_camera_container: {
        width: width - 10,
        height: height / 1.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payment_camera: {
        width: width - 10,
        height: height / 1.7,
        marginLeft: 10,
        marginTop: 10,
    },
};
