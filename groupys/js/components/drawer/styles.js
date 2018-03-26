import loginTheme from './drwaer-theme';

const React = require('react-native');
import StyleUtils from "../../utils/styleUtils";
const {Dimensions, StyleSheet, Platform} = React;
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
    thumbnail: {


        borderRadius: (Platform.OS === 'ios') ? 90 : 90,
        width: StyleUtils.scale(120),
        height: StyleUtils.scale(120),
    },
    thumbnail_image: {
        position: 'absolute',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        borderRadius: StyleUtils.scale(90),
        opacity: 1,
        backgroundColor: 'black',
        width: StyleUtils.scale(120),
        height: StyleUtils.scale(120),
    },
    image: {
        backgroundColor: '#41aad9',
        flexDirection: 'column',
        alignItems : 'center',
        justifyContent: 'center',

        height: StyleUtils.scale(152),

    },
};
