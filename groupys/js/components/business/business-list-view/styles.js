const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
module.exports = {
    editButtonConntainer: {
        margin:5,width: 40, height: 40, opacity: 0.65,backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'
    },
    businessPiker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
        height: 80,
        marginTop:5,
    },
    pickerStyle: {
        margin: 3, height: 50, width: width - 60, backgroundColor: 'white'
    },
    businessTopLogo:{
        padding:10,
        flex:1
    },
    businessPikkerComponent:{
        flex:3
    },
    businessNameText:{
        color: '#ff6400',
    },
    businessCategoryText:{
        color:'#839192',
    },
    productIcon: {
        fontSize: 25,
        color: 'black',
    },
    bannerImageContainer:{
        flex: -1,
        alignSelf: 'center',
        alignItems:'flex-end',
        height: 250,

        width: width,
        borderWidth: 1,
    },
    imageTopText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold', marginLeft: 20, marginTop: -100, fontSize: 25, color: 'white'
    },
    imageButtomText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: -100,
        marginBottom: 10,
        color: 'white',
        fontSize: 15
    },
    tabHeadingStyle:{
        flexDirection:"row",
        justifyContent: 'space-between',

    },
    tabTextStyle:{
        color: '#ff6400',
        marginRight:10,
        marginLeft:10,
        fontSize:14

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
};
