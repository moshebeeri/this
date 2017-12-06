


class PageSync{

    constructor() {
        this.pages = {
        };

        this.constantTimeRefresher = new PageSync.RefreshPolicy('constantTimeRefresher', 1000);
        this.stdAverageRefresh = new PageSync.AveragePolicy('stdAverageRefresh', 10, 5000);
        this.offlineRefresh = new PageSync.OfflinePolicy('offlinePolicy', 1000);

        // this.createPage('pageA', this.constantTimeRefresher);
        // this.createPage('pageB', this.stdAverageRefresh, () => {
        //     console.log('I am pageB stdAverageRefresh refresher function')
        // });
        // this.createPage('pageC', this.offlineRefresh, () => {
        //     console.log('I am pageB stdAverageRefresh refresher function')
        // });
    }

    constantTimeRefresher(){return this.constantTimeRefresher}
    stdAverageRefresh(){return this.stdAverageRefresh}

    createConstantTimeRefresher(name, millis){return new PageSync.RefreshPolicy(name, millis)}
    createStdAverageRefresh(name, historyLength, maxMillis){return new PageSync.AveragePolicy(name, historyLength, maxMillis)}
    createOfflineRefresh(name, startMillis){return new PageSync.OfflinePolicy(name, startMillis)}

    createPage(name, policy, refresher) {
        this.pages[name] =  new PageSync.Page(name, policy, refresher);
    };

    visited(page) {
        page = this.pages[page];
        page.visited()
    };

    check() {
        Object.values(this.pages).forEach(page => page.check())
    };

}

PageSync.Page = class {
    constructor(name, policy, refresher) {
        this.name = name;
        this.policy = policy;
        this.refresher = refresher;
    }

    visited(){
       // console.log(`${this.name} visited at ${new Date().toISOString()}`);
        this.policy.visited();
    }

    check(){
        let shouldRefresh = this.policy.shouldRefresh();
      //  console.log(`${this.name} check ${new Date().toISOString()} result ${shouldRefresh}`);
        if(shouldRefresh && this.refresher)
            this.refresher()
            
    }
};

PageSync.RefreshPolicy = class {
    constructor(name, millisBetweenSync) {
        this.name = name;
        this.millis = millisBetweenSync;
    }

    visited(){
        this.lastVisit = Date.now();
    }

    shouldRefresh(page){
        return Date.now() > this.millis + this.lastVisit
    }
};

PageSync.AveragePolicy = class extends PageSync.RefreshPolicy{
    constructor(name, historyLength, millisBetweenSync, lastRefresh) {
        super(name, millisBetweenSync);
        this.historyLength = historyLength;
        if(lastRefresh)
            this.lastRefresh = lastRefresh;
        else
            this.lastRefresh = Date.now();
        this.history = [];
    }

    visited(){
        this.history.push(this.lastVisit = Date.now());
        if(this.historyLength < this.history.length)
            this.history.shift();
    }

    shouldRefresh(page){
        //console.log(`AveragePolicy shouldRefresh ${this.history.length} ${Date.now() - this.lastVisit} > ${this.millis}`)
        if(Date.now() > this.millis + this.lastRefresh){
            console.log(`AveragePolicy shouldRefresh by max time`);
            this.lastRefresh = Date.now();
            return true;
        }
        let prev;
        let sum = 0;
        let i = 0;
        this.history.forEach(date => {
            if(!prev) {
                prev = date;
            }else{
                sum += date - prev;
                i++;
            }
        });
        const average = sum/i;

        if(Date.now() > average + this.lastRefresh){
            console.log(`AveragePolicy shouldRefresh by average`);
            this.lastRefresh = Date.now();
            return true;
        }

        return false;
    }
};

PageSync.OfflinePolicy = class extends PageSync.RefreshPolicy {
    constructor(name, incrementFactor, startMillis) {
        super(name, startMillis);
        this.incrementFactor = incrementFactor;
        this.currentDelta = startMillis;
    }

    visited() {
        this.lastVisit = Date.now();
        this.currentDelta = this.millis;
    }

    shouldRefresh(page) {
        if(this.lastVisit + this.currentDelta > Date.now()){
            this.currentDelta *= this.incrementFactor;
            return true;
        }
        return false;
    }
};

let pageSync = new PageSync();

export default pageSync;

// function run_me(){
//     //pageSync.visited('pageA');
//     pageSync.visited('pageB');
// }
// function check(){
//     pageSync.check();
// }
