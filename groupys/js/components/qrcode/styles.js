

import loginTheme from './qccode-theme';

const React = require('react-native');

const { StyleSheet,Dimensions, Platform } = React;

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
    } ,

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
    row: {
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#ededed',
        borderBottomWidth: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    imageButtomText:{
        textShadowOffset:{width:1,height:1},
        textShadowColor:'black',fontWeight: 'bold',marginLeft:20,marginTop:5,color:'white',fontSize:15
    },
  transparentButton: {
    padding: 0,
    alignItems: 'flex-start',
  },
    approveBtn:{
        height: 70,


        width:150
    },

};
