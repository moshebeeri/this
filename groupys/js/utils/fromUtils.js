

const validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


const validateWebsite = (website) => {
    if(!website){
        return true;
    }
    let re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    return re.test(website);
};

const validatePuches = (number) => {
    if(number > 10){
        return false;
    }
    if(number === 0){
        return false;
    }

    if(number < 0){
        return false;
    }
    return true;
};
const validatePercent = (number) => {
    if(number > 100){
        return false;
    }
    if(number === 0){
        return false;
    }

    if(number < 0){
        return false;
    }
    return true;
};



export default {
    validateEmail,
    validateWebsite,
    validatePuches,validatePercent
};