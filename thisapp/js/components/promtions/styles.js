import loginTheme from './promotions-theme';

const React = require('react-native');
const {StyleSheet, Platform} = React;
module.exports = {
    follow_search: {
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    follow_search_field: {
        marginRight: 20, backgroundColor: 'white'
    },
    addProductContainer:{
        height:40,
        marginTop:3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor:'white',
    },
    addProductButton:{
        marginTop:10,
        width:130,
        flexDirection: 'row',
    },
    addProductTextStyle:{
        color: '#ff6400',
        marginRight:5,
        marginLeft:10,
        fontSize:14
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
};