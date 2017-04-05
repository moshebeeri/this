const React = require('react-native');

const { StyleSheet, Dimensions,Platform } = React;

module.exports = {
  header: {
    width: Dimensions.get('window').width,
      flexDirection: 'column',
    marginLeft: (Platform.OS === 'ios') ? undefined : -15,
      backgroundColor: '#fff',

  },
    button:{
        backgroundColor: 'transparent'

    }
};
