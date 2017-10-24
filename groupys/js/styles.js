import {
    setCustomView,
    setCustomTextInput,
    setCustomText,
    setCustomImage,
    setCustomTouchableOpacity
} from 'react-native-global-props';

const React = require('react-native');
const {Platform, Dimensions} = React;

// Setting a default background color for all View components.
const customViewProps = {
    style: {
        backgroundColor: 'white'
    }
};

// Getting rid of that ugly line on Android and adding some custom style to all TextInput components.
const customTextInputProps = {
    underlineColorAndroid: 'rgba(0,0,0,0)',
    style: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    }
};

// Setting default styles for all Text components.
const customTextProps = {
    style: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
        color: 'black'
    }
};

// Makes every image resize mode cover by default.
const customImageProps = {
    resizeMode: 'cover'
};

// Adds a bigger hit box for all TouchableOpacity's.
const customTouchableOpacityProps = {
    hitSlop: { top: 15, right: 15, left: 15, bottom: 15 }
};

export default function setCustomStyles(){
    setCustomView(customViewProps);
    setCustomTextInput(customTextInputProps);
    setCustomText(customTextProps);
    setCustomImage(customImageProps);
    setCustomTouchableOpacity(customTouchableOpacityProps);
}


