function checkIfRealized(feed){
    let savedinstance = feed;
    if(feed.savedInstance){
        savedinstance = feed.savedInstance;
    }
    if(savedinstance.savedData && savedinstance.savedData && savedinstance.savedData.other ){
        return true;
    }
    if(savedinstance.savedData && savedinstance.savedData.punch_card && savedinstance.savedData.punch_card.number_of_punches){
        let remainPunches =  savedinstance.savedData.punch_card.number_of_punches - savedinstance.savedData.punch_card.redeemTimes.length;
        return remainPunches === 0;
    }

    return false;
}


export default {
    checkIfRealized,

};