



const React = require('react-native');

const { StyleSheet, Platform } = React;

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
