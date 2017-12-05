import loginTheme from './drwaer-theme';

const React = require('react-native');
const {Dimensions, StyleSheet, Platform} = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
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
        position: 'absolute',
        left: 180,
        top: 40,

        borderRadius: (Platform.OS === 'ios') ? 80 : 50,

        width: 85,
        height: 85,
    },
    thumbnail_image: {
        position: 'absolute',
        borderWidth: 2,

        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        borderRadius: 50,
        width: 85,
        height: 85,
    },
    image: {
        backgroundColor: '#FF9046',
        flexDirection: 'row',
        height: 152,
        width: deviceWidth,
    },
};
