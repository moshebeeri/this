const React = require('react-native');

const { StyleSheet, Dimensions,Platform } = React;

module.exports = {
  header: {
    width: Dimensions.get('window').width,
      flexDirection: 'column',

      height:50
  },
    button:{
        backgroundColor: 'transparent'

    }
};
