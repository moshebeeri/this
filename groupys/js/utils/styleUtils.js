/**
 * Created by roilandshut on 22/08/2017.
 */
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window')
/**
 *
 * @param {ScaledSize} dim the dimensions object
 * @param {*} limit the limit on the scaled dimension
 */
const msp = (dim, limit) => {
    return (dim.scale * dim.width) >= limit || (dim.scale * dim.height) >= limit;
};
/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const getWidth = () => {
    if(isPortrait()){
        return width;
    }
    return height;
}

const getHeight = () => {
    if(isPortrait()){
        return height;
    }
    return width;
}
/**
 * Returns true of the screen is in landscape mode
 */
const isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
};
/**
 * Returns true if the device is a tablet
 */
const isTablet = () => {
    const dim = Dimensions.get('screen');
    return ((dim.scale < 2 && msp(dim, 1000)) || (dim.scale >= 2 && msp(dim, 1900)));
};
/**
 * Returns true if the device is a phone
 */
const isPhone = () => {
    return !isTablet();
};
const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const parseUserPhoneNumber = (user) => {
    if(!user)
        return '';
   return `+${user.country_code}-${user.phone_number}`
};

export default {
    isPortrait,
    isLandscape,
    isTablet,
    getWidth,
    getHeight,
    isPhone,
    toTitleCase,
    parseUserPhoneNumber
};