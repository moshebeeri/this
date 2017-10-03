import loginTheme from './add-group-theme';

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
        backgroundColor: loginTheme.darkenButton,
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
    container: {
        flex: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 10
    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        marginLeft: 10,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: "left",
        width: 50
    },
    row: {
        marginTop: 5,
        flexDirection: 'row'
    },
    input: {
        height: 20,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1
    },
    btnClickContain: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 5,
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        borderRadius: 10,
    },
    btnIcon: {
        height: 25,
        width: 25,
    },
    btnText: {
        fontSize: 3,
        color: '#FAFAFA',
        marginLeft: 10,
        marginTop: 2,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        borderRadius: 3,
        padding: 32,
        width: 100,
        marginTop: 64,
        marginBottom: 64,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    attachButton: {
        paddingHorizontal: 50,
        borderRadius: 4,
        height: 40,
        padding: 4,
        backgroundColor: 'transparent'
    },
    login: {
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: loginTheme.darkenButton,
        paddingHorizontal: 40,
    },
};
