import loginTheme from './business-theme';

const React = require('react-native');
const {StyleSheet, Platform,Dimensions} = React;


const {width, height} = Dimensions.get('window');
module.exports = {
    listBusinessesContainer: {
        flex: 1,
        backgroundColor:'white'
    },
    businessPiker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        margin:10
    },
    pickerStyle: {
        margin: 3, height: 50, width: width - 60, backgroundColor: 'white'
    },
    businessDetailsContainer:{
        width:width,
        flex:3
    },
    businessTopLogo:{
        padding:10,
        flex:1
    },
    businessPikkerComponent:{
        flex:5
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
        borderRadius: 1,
        transform: [
            {scaleX: 1}
        ],
        backgroundColor: '#fff',
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
