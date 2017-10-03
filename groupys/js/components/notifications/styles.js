import loginTheme from './product-theme';

const React = require('react-native');
const {StyleSheet, Platform} = React;
module.exports = {
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
        borderRadius: 1,
        transform: [
            {scaleX: 1}
        ],
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    button: {
        marginRight: 10
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
        backgroundColor: loginTheme.darkenButton,
        paddingHorizontal: 40,
    },
    logoButton: {
        paddingHorizontal: 20,
        borderRadius: 4,
        height: 20,
        padding: 4,
    },
    row: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#ededed',
        borderBottomWidth: 1
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start',
    },
};
