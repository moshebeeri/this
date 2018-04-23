function checkIfRealized(feed) {
    let savedinstance = feed;
    if (feed.savedInstance) {
        savedinstance = feed.savedInstance;
    }
    if (savedinstance.savedData && savedinstance.savedData && savedinstance.savedData.other) {
        return true;
    }
    if (savedinstance.savedData && savedinstance.savedData.punch_card && savedinstance.savedData.punch_card.number_of_punches) {
        let remainPunches = savedinstance.savedData.punch_card.number_of_punches - savedinstance.savedData.punch_card.redeemTimes.length;
        return remainPunches === 0;
    }
    return false;
}

function checkIfExpired(feed) {
    try {
        let savedinstance = feed;
        if (feed.savedInstance) {
            savedinstance = feed.savedInstance;
        }
        if (savedinstance && savedinstance.instance && savedinstance.instance.promotion && savedinstance.instance.promotion.end) {
            let expieredDate = new Date(savedinstance.instance.promotion.end);
            return expieredDate.getTime() < new Date().getTime();
        }
    } catch (err) {
        console.log('failed')
    }
    return false;
}

function checkIfActive(feed) {
    let savedinstance = feed;
    if (feed.savedInstance) {
        savedinstance = feed.savedInstance;
    }
    switch (savedinstance.type) {
        case "HAPPY_HOUR":
            let happyHourData = savedinstance.savedData.happy_hour;
            let day = new Date().getDay() + 1;
            if (!happyHourData.days.includes(day)) {
                return false;
            }
            let currentTime = new Date();
            let secs = currentTime.getSeconds() + (60 * currentTime.getMinutes()) + (60 * 60 * currentTime.getHours());
            if (secs < happyHourData.from || secs > happyHourData.until) {
                return false;
            }
            break;
    }
    return true;
}

function showClaim(item,saved){
    if(item.actionOff){
        return false;
    }
    return !item.isRealized && !item.isExpired && item.isActive && !item.isSaved && !saved
}
function showRedeemed(item){
    if(item.actionOff){
        return false;
    }
    return item.isRealized
}

function showRedeem(item,saved){
    if(item.actionOff){
        return false;
    }
    return !item.isRealized && !item.isExpired && item.isActive && (item.isSaved || saved)
}

function showExpired(item){
    if(item.actionOff){
        return false;
    }
    return !item.isRealized && item.isExpired
}

function showInActive(item){
    if(item.actionOff){
        return false;
    }
    return !item.isRealized && !item.isActive && !item.isExpired
}



export default {
    checkIfRealized,
    checkIfExpired,
    checkIfActive,
    showClaim,
    showRedeem,
    showRedeemed,
    showExpired,
    showInActive

};