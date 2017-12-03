const React = require('react-native');
const {Dimensions} = React;
const {width, height} = Dimensions.get('window');
module.exports = {
    picker: {
        margin: 3, height: 50, width: width - 25, backgroundColor: 'white'
    },
    pickerInvalid: {
        margin: 3, height: 50, width: width - 25, backgroundColor: 'red',borderWidth:1,borderColor:'red'
    },
    pickerTitleContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    pickerTextStyle: {
        color: '#3A3A3A',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 10,
        marginBottom:5,

    },
    modalView: {
        width: width - 20,
        height: 40,

        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor:'white',


        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
    },
    modalViewStyle: {
        width: width - 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    }
};





