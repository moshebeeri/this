

const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

// const primary = require('../../themes/variable').brandPrimary;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  topSection: {
    height: (Platform.OS === 'IOS') ? deviceHeight / 3 : deviceHeight / 4,
    backgroundColor: '#3B5998',
  },
  iosShadow: {
    flex: 1,
    width: (deviceHeight < 500) ? 80 : (deviceWidth / 8) + 12,
    resizeMode: 'contain',
    height: (deviceHeight < 500) ? 50 : (deviceHeight / 15),
    alignSelf: 'center',
    marginTop: (deviceHeight < 500) ? undefined : 80,
  },
  aShadow: {
    width: (deviceWidth / 6),
    height: (deviceWidth / 5),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 70,
  },
  inputGrp: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 20,
  },
  input: {
    color: 'rgba(255,255,255,0.5)',
  },
  background: {
    flex: 1,
    width: null,
    height: deviceHeight,
    backgroundColor: '#3B5998',
  },
  bg: {
    flex: 1,
  },
  loginBtn: {
    backgroundColor: '#4E69A2',
    borderRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
    height: 45,
    marginBottom: 15,
  },
  forgotPassword: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  createBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 0,
    marginTop: 70,
  },
  createBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
});
