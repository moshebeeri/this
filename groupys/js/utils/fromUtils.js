const validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
const validateWebsite = (website) => {
    if (!website) {
        return true;
    }
    let re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    return re.test(website);
};
const validatePuches = (number) => {
    if (number > 10) {
        return false;
    }
    if (number === 0) {
        return false;
    }
    if (number < 0) {
        return false;
    }
    return true;
};
const validatePercent = (number) => {
    if (number > 100) {
        return false;
    }
    if (number === 0) {
        return false;
    }
    if (number < 0) {
        return false;
    }
    return true;
};
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d.toFixed(1);
};
const getSecondSinceMidnight = (hour) => {
    let currentDate = parseTime(hour);
    let e = new Date(currentDate);
    return (currentDate - e.setHours(0, 0, 0, 0)) / 1000;
};
const convertDaysNumToString = (days) => {
    if (Array.isArray(days)) {
        return reduceToBetween(days);
    } else {
        let dayArray = [];
        Object.keys(days).forEach(day => {
            dayArray.push(days[day])
        });
        return reduceToBetween(dayArray);;
    }
};
const secondsFromMidnightToString = (seconds) => {
    let d = new Date();
    let hours = Math.round(seconds / 3600);
    let m = Math.round((seconds - ( hours * 3600) ) / 60);
    let hourString = hours
    if (hours < 10) {
        hourString = "0" + hours;
    }
    let stringMinutes = m;
    if (m < 10) {
        stringMinutes = "0" + stringMinutes;
    }
    return hourString + ":" + stringMinutes
}

function reduceToBetween(days) {
    let reduce = [];
    let index = 0;
    let indexReduce = 0
    days.forEach(day => {
        if (reduce[index] && reduce[index][indexReduce] + 1 === day) {
            reduce[index].push(day)
            indexReduce = indexReduce +1;
        } else {
            indexReduce = 0;
            if( reduce[index]){
                index = index +1;
                reduce[index] = [];
            }else {
                reduce[index] = [];
            }
            reduce[index].push(day);
        }
    })
    return reduce.map(array => {
        if(array.length === 1){
            return getDay(array[0])
        }else{
            return getDay(array[0]) + '-' + getDay(array[array.length -1])
        }
    })
}

function getDay(day) {
    if (day === 1) {
        return "Sunday";
    }
    if (day === 2) {
        return "Monday"
    }
    if (day === 3) {
        return "Tuesday"
    }
    if (day === 4) {
        return "Wednesday"
    }
    if (day === 5) {
        return "Thursday"
    }
    if (day === 6) {
        return "Friday"
    }
    if (day === 7) {
        return "Saturday"
    }
}

function parseTime(text) {
    let time = text.match(/(\d?\d):?(\d?\d?)/);
    let h = parseInt(time[1], 10);
    let m = parseInt(time[2], 10) || 0;
    if (h > 24) {
        // try a different format
        time = text.match(/(\d)(\d?\d?)/);
        h = parseInt(time[1], 10);
        m = parseInt(time[2], 10) || 0;
    }
    let d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export default {
    validateEmail,
    validateWebsite,
    validatePuches, validatePercent,
    getDistanceFromLatLonInKm,
    getSecondSinceMidnight,
    convertDaysNumToString,
    secondsFromMidnightToString
};