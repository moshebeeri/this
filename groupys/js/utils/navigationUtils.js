import {Platform} from 'react-native';

let debounce = true;
function doNavigation(navigation,route,params){
    if(Platform.OS === 'ios'){
        if(params){
            navigation.navigate(route,params);
        }else {
            navigation.navigate(route);
        }
    }else {
        if (debounce) {
            debounce = false;
            if (params) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate(route);
            }
            setTimeout(() => {
                debounce = true;
            }, 200);
        }
    }

}



export default {
    doNavigation,
}