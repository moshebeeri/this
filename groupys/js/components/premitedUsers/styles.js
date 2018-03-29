import StyleUtils from '../../utils/styleUtils'

const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;

module.exports = {
    addProductContainer: {
        height: 40,
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    addProductButton: {
        marginTop: 10,
        width: 140,
        flexDirection: 'row',
    },
    addProductTextStyle: {
        color: '#ff6400',
        marginRight: 5,
        marginLeft: 10,
        fontSize: 14
    },
    shadow: {
        flex: 1,
        width: 330,
        height: 330,
        backgroundColor: 'transparent',
    },
    AddContainer: {
        paddingHorizontal: 20,
        marginTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginTop: -120,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 20,
    },
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: (Platform.OS === 'ios') ? 10 : 0,
        marginTop: (Platform.OS === 'ios') ? -10 : 0,
    },
    addButton: {
        marginBottom: 10,
        alignSelf: 'center',
        paddingHorizontal: 40,
    },
    logoButton: {
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
        backgroundColor: 'transparent'
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start',
    },
    list_user_view: {
        backgroundColor: 'white', flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 0.3,
        borderColor: '#e6e6e6',
        padding: 5,
        height: StyleUtils.scale(70),
    },
};
