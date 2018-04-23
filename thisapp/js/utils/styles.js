import loginTheme from '../components/login/login-theme';

const React = require('react-native');
const {StyleSheet, Platform} = React;
module.exports = {
    shadow: {
        flex: 1,
        width: 330,
        height: 330,
        backgroundColor: 'transparent',
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
    login: {
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: loginTheme.darkenButton,
        paddingHorizontal: 40,
    },
    logoButton: {
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
    },
    transparentButton: {
        padding: 0,
        alignItems: 'flex-start',
    },
    sidebarIconView: {
        alignItems: 'flex-start',
        backgroundColor: '#00afc1',
        width: 30,
        height: 30,
        borderRadius: 15,
        paddingLeft: 11,
        paddingTop: (Platform.OS === 'android') ? 4 : 0,
        marginRight: 17,
    },
    sidebarList: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    sidebarIcon: {
        fontSize: 21,
        top: (Platform.OS === 'ios') ? 4 : 0,
        backgroundColor: 'transparent',
    },
};
