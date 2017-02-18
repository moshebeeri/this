const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  backBtn: {
    color: '#fff',
    fontSize: 24,
  },
  header: {
    color: '#fff',
  },
  notificationContainer: {
    flexDirection: 'row',
  },
  notificationUntouched: {
    backgroundColor: '#fff',
  },
  textBlock: {
    flexWrap: 'wrap',
    width: deviceWidth - (45 + 70),
  },
  head: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 15,
  },
  time: {
    fontSize: 13,
    color: '#8C9099',
    marginLeft: 15,
  },
});
