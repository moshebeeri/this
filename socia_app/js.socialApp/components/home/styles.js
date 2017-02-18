

const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  text: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: (Platform.OS === 'ios') ? undefined : -30,
  },
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 7 : 0,
  },
  col: {
    height: 50,
    width: deviceWidth / 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  topOptions: {
    color: '#484D51',
    marginTop: 10,
  },
  topIcons: {
    color: '#484D51',
  },
  searchInputGroup: {
    flex: 1,
    height: 40,
    paddingBottom: 0,
    marginRight: 15,
    marginBottom: (Platform.OS === 'ios') ? undefined : 8,
    backgroundColor: '#293E6B',
    borderRadius: 8,
    borderBottomWidth: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
  searchIcon: {
    fontSize: 20,
  },
  inputBox: {
    height: 40,
  },
  sidebarIcon:{
    resizeMode: 'contain',
    height: 30,
    width: 30,
  },
  contentView: {
    backgroundColor: '#D3D6DB',
    flex: 1,
  },
  detailsBlock: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginTop: 10,
  },
  whatsOnMind: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 10,
  },
  navLinks: {
    height: 50,
    paddingTop: 10,
    flexDirection: 'row',
  },
  navLinkBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navLinkIcons: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
    marginTop: 10,
  },
  navLinkText: {
    marginLeft: 10,
    color: '#6A7181',
    fontSize: 15,
    marginTop: 8,
  },
  nameText: {
    color: '#94979E',
    fontSize: 20,
    marginTop: 20,
    marginLeft: 10,
  },
  listViewBlock: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFE1',
    borderTopWidth: 1,
    borderTopColor: '#DFDFE1',
  },
  listItemView: {
    borderWidth: 1,
    borderColor: '#CFCFCF',
    padding: 10,
  },
  userName: {
    fontSize: 20,
    color: '#1B1C21',
    marginTop: 5,
  },
});
