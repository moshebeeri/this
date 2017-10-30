const React = require('react-native');
const {Dimensions, Platform} = React;
const {width, height} = Dimensions.get('window')
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
        justifyContent: 'flex-start',
    },
    addCoverContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
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
    avoidView: {
        alignSelf: 'stretch',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    business_upper_image_container: {
        width: width / 3,
        height: 110,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
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
        width: width ,
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
    buttom_items: {
        margin: 3,
        backgroundColor: 'white',
        width: width - 18
    },
    inputTextLayour: {
        marginTop: 4, padding: 3,
        width: width - 15
    }
};
