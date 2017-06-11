import loginTheme from './general-theme';

const React = require('react-native');

const {StyleSheet,Dimensions, Platform} = React;

const {width, height} = Dimensions.get('window')
module.exports = {
    itemborder:{

        justifyContent: 'center',
        alignItems: 'center',
        padding:3,

    },

    item:{

        backgroundColor:'white',
        borderColor:'black',


        width: width/1.4
    },

    icon:{

        backgroundColor:'white',
        borderColor:'black',

        justifyContent: 'center',
        alignItems: 'center',



    }

};
