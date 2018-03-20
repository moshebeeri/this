const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    picker: {
        marginTop: 5, height: 50, width: width - 15, backgroundColor: 'white', justifyContent: 'flex-start'
    },
    pickerInvalid: {
        marginTop: 5,
        height: 50,
        width: width - 15,
        backgroundColor: 'red',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: 'red'
    },
    pickerTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pickerTextStyle: {
        color: '#666666',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginLeft: 2,
        // margiRight:  I18nManager.isRTL ? 0:10,
        marginBottom: 2,
    },
    modalView: {
        width: width - 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: 'white',
        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
    },
    modalViewInvalid: {
        width: width - 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
    },
    modalViewStyle: {
        width: width - 20,
        height: 70,
        // paddingRight: I18nManager.isRTL ? 0 : 50,
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
};





