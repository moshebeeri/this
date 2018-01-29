const React = require('react-native');
const {Dimensions, Platform} = React;
import StyleUtils from "../../../utils/styleUtils";

const width = StyleUtils.getWidth();
const height = StyleUtils.getHeight();
module.exports = {
    business_container: {
        flex: 1,
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    business_upper_container: {
        width: width,
        height: 220,
        backgroundColor: '#FA8559',
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    cmeraLogoContainer: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCoverContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    addCoverNoImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    addCoverText: {
        color: 'white', margin: 5, fontSize: 16
    },
    avoidView: {
        alignSelf: 'stretch',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    business_upper_image_container: {
        width: 105,
        height: 111,
        marginTop: 10,
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        position: 'absolute',
        top: 5,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginLeft: 10,

    },
    business_no_pic_no_cover_upper_image_container: {
        width: 111,
        height: 105,
        marginTop: 10,
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,

        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginLeft: 10,

    },
    business_no_pic_upper_image_container: {
        width: width / 3,
        height: 110,
        marginTop: 10,
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 20, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginLeft: 10,
        backgroundColor: 'white'
    },
    businessCoverPhotoContainer: {
        width: width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    business_upper_name_container: {
        width: width / 3 + 80,
        height: 90,
        marginTop: 10,
        marginBottom: 12,
        marginRight: 12,
    },
    picker: {
        margin: 3, height: 50, width: width - 18, backgroundColor: 'white'
    },
    itemborder: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
    },
    buttonsBorder: {
        flexDirection: 'row',
        padding: 3,
        paddingLeft: 25
    },
    buttons: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderBottomWidth: 1,
        width: 100,
        height: 40,
        padding: 3,
        borderRadius: 10
    },
    item: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderBottomWidth: 1,
        width: width / 1.2
    },
    shortItem: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderBottomWidth: 1,
        width: width / 2.44
    },
    addButton: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderBottomWidth: 1,
        width: width / 1.2,
        height: 40,
        borderRadius: 10
    },
    addButtonText: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width / 1.2,
        padding: 10,
        paddingLeft: 95
    },
    contentContainer: {
        alignSelf: 'stretch',
        flex: 4,
        width: width,
    },
    bottom_items: {
        margin: 3,
        backgroundColor: 'white',
        width: width - 18
    },
    inputTextLayout: {
        marginTop: 4, padding: 3,
        width: width - 15
    }
};
