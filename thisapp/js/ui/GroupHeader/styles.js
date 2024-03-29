const React = require('react-native');
const {Dimensions} = React;
import StyleUtils from "../../utils/styleUtils";
const {width} = Dimensions.get('window')
module.exports = {
    logo_view: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    groupEntity: {
       fontWeight: '200', color: '#616F70', fontSize: StyleUtils.scale(14),
    },
    businessNameText: {
        fontFamily: 'Roboto-Regular',
        marginRight: 20,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        color: 'gray',
        fontSize: StyleUtils.scale(18)
    },
    groupNameText: {
        fontFamily: 'Roboto',
        color: '#616F70',
        fontWeight: 'bold',
        width: StyleUtils.scale(200),
        fontSize: StyleUtils.scale(18)
    },
    groupHeader: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "center",
        width: width - 30
    },
    groupImage: {
        alignItems: 'center'
    },
    groupName: {
        margin: 5,
        marginLeft: 10,
    },
    editButtonConntainer: {
        margin: 5,
        width: 40,
        height: 40,
        opacity: 0.65,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    businessPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    pickerStyle: {
        margin: 3, height: 50, width: width - 60, backgroundColor: 'white'
    },
    businessTopLogo: {
        padding: 10,
        flex: 1
    },
    businessPickerComponent: {
        flex: 7
    },
    businessGroupText: {
        color: '#ff6400',
    },
    businessCategoryText: {
        color: '#839192',
    },
    productIcon: {
        fontSize: StyleUtils.scale(25),
        color: 'black',
    },
    bannerImageContainer: {
        flex: -1,
        alignSelf: 'center',
        alignItems: 'flex-end',
        height: 250,
        width: width,
        borderWidth: 1,
    },
    imageTopText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold', marginLeft: 20, marginTop: -100, fontSize: StyleUtils.scale(25), color: 'white'
    },
    imageBottomText: {
        textShadowOffset: {width: 1, height: 1},
        textShadowColor: 'black',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: -100,
        marginBottom: 10,
        color: 'white',
        fontSize: StyleUtils.scale(15)
    },
    tabHeadingStyle: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    tabTextStyle: {
        color: '#ff6400',
        marginRight: 10,
        marginLeft: 10,
        fontSize: StyleUtils.scale(14)
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
        backgroundColor: 'white',
    },
    img: {
        width: Dimensions.get('window').width,
    },
};
