import instanceUtils from './instanceUtils'

class InstanceLifeCycle {
    savedInstancesIds = [];
    redeemedInstancesIds = [];
    expiredInstancesIds = [];
    inActiveInstancesIds = [];

    constructor(feeds) {
        if (feeds) {
            this.savedInstancesIds = Object.values(feeds).map(savedFeed => {
                if (savedFeed.savedInstance) {
                    return savedFeed.savedInstance._id
                }
                return savedFeed.instance._id
            });
            this.redeemedInstancesIds = Object.values(feeds).map(savedFeed => {
                let isRedeemed = instanceUtils.checkIfRealized(savedFeed);
                if (isRedeemed) {
                    if (savedFeed.savedInstance) {
                        return savedFeed.savedInstance._id
                    }
                    return savedFeed.instance._id
                }
                return undefined;
            });
            this.expiredInstancesIds = Object.values(feeds).map(savedFeed => {
                let expired = instanceUtils.checkIfExpired(savedFeed);
                if (expired) {
                    if (savedFeed.savedInstance) {
                        return savedFeed.savedInstance._id
                    }
                    return savedFeed.instance._id
                }
                return undefined;
            });
            this.inActiveInstancesIds = Object.values(feeds).map(savedFeed => {
                let isActive = instanceUtils.checkIfActive(savedFeed);
                if (isActive) {
                    if (savedFeed.savedInstance) {
                        return savedFeed.savedInstance._id
                    }
                    return savedFeed.instance._id
                }
                return undefined;
            });
        }
    }

    isExpired(instanceId,endDate) {
        if(endDate){
            return endDate.getTime() < new Date().getTime();
        }

        if(!this.savedInstancesIds.includes(instanceId)){
            return false;
        }
        return this.expiredInstancesIds.includes(instanceId) && !this.redeemedInstancesIds.includes(instanceId);
    }

    isSaved(instanceId) {
        return this.savedInstancesIds.includes(instanceId);
    }

    isActive(instanceId) {
        if(!this.savedInstancesIds.includes(instanceId)){
            return true;
        }
        return this.inActiveInstancesIds.includes(instanceId)  && !this.redeemedInstancesIds.includes(instanceId) && !this.expiredInstancesIds.includes(instanceId) ;
    }

    isReedemed(instanceId) {
        if(!this.savedInstancesIds.includes(instanceId)){
            return false;
        }
        return this.redeemedInstancesIds.includes(instanceId);
    }

    nonRealize(instanceId) {
        if(!this.savedInstancesIds.includes(instanceId)){
            return true;
        }
        return !this.redeemedInstancesIds.includes(instanceId) && !this.expiredInstancesIds.includes(instanceId) && this.inActiveInstancesIds.includes(instanceId) ;
    }
}

export default InstanceLifeCycle