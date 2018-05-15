/**
 * Created by roilandshut on 22/08/2017.
 */
import {Dimensions,Platform} from 'react-native';
import LinkPreview from 'react-native-link-preview';
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
    const dim =Dimensions.get('window')
    if(isPortrait()){
        return dim.height;
    }
    return dim.width;
}

const containLink = async (text) => {
    try {
        await LinkPreview.getPreview(text);
        return true;
    }catch (error){
       return false;
    }
};
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
   return `${user.phone_number}`
};
const relativeWidth= (widthIos,widthAndroid) => {
    const {width, height} = Dimensions.get('window')

    let  vw = width / 100;
    if(isLandscape()){
        vw = height / 100;
    }
    if(isTablet()){
        if(Platform.OS ==='ios') {
            return widthIos * vw * 1.2
        }
        return widthAndroid * vw * 1.2

    };
    if(Platform.OS ==='ios'){
        return widthIos * vw
    }else{
        return widthAndroid * vw
    }
};

const relativeHeight = (heightIos,heightAndroid) => {
    const {width, height} = Dimensions.get('window')

    let  vh = height / 100;
    if(isLandscape()){
        vh = width / 100;
    }
    if(isTablet()){
        if(Platform.OS ==='ios') {
            return heightIos * vh * 1.2
        }
        return heightAndroid * vh * 1.2

    };
    if(Platform.OS ==='ios'){
        return heightIos * vh;
    }else{
        return heightAndroid * vh
    }
};

//deline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => {

    if (isTablet() && Platform.OS ==='ios' ) {
        return width / guidelineBaseWidth * size /1.6 ;
    }
    return width / guidelineBaseWidth * size
}


const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export default {
    isPortrait,
    isLandscape ,
    isTablet,
    getWidth,
    getHeight,
    isPhone,
    toTitleCase,
    parseUserPhoneNumber,
    containLink,
    relativeHeight,
    relativeWidth,
    verticalScale,
    moderateScale,
    scale
};