

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

const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) =>{
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d.toFixed(1);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}



export default {
    validateEmail,
    validateWebsite,
    validatePuches,validatePercent,
    getDistanceFromLatLonInKm
};