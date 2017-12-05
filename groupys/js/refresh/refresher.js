


class PageSync{

    constructor() {
        this.chatRefresher = new PageSync.RefreshPolicy('chatRefresher', 1000);
        this.stdAverageRefresh = new PageSync.AveragePolicy('stdAverageRefresh', 10, 5000);

        this.pages = {
        };
        //this.createPage('pageA', this.chatRefresher);
        this.createPage('pageB', this.stdAverageRefresh, () => {
            console.log('I am pageB stdAverageRefresh refresher function')
        });
        //this.createPage('pageC', this.stdAverageRefresh);
        //this.createPage('pageD', this.stdAverageRefresh);

    }

    chatRefresher(){return this.chatRefresher}
    stdAverageRefresh(){return this.stdAverageRefresh}

    createChatRefresher(name, millis){new PageSync.RefreshPolicy(name, millis)}
    createStdAverageRefresh(name, historyLength, maxMillis){new PageSync.AveragePolicy(name, historyLength, maxMillis)}
    
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
        console.log(`${this.name} visited at ${new Date().toISOString()}`);
        this.policy.visited();
    }

    check(){
        let shouldRefresh = this.policy.shouldRefresh();
        console.log(`${this.name} check ${new Date().toISOString()} result ${shouldRefresh}`);
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
        return Date.now() - this.lastVisit > this.millis
    }
};

PageSync.AveragePolicy = class extends PageSync.RefreshPolicy{
    constructor(name, historyLength, millisBetweenSync) {
        super(name, millisBetweenSync);
        this.historyLength = historyLength;
        this.history = [];
    }

    visited(){
        this.lastVisit = Date.now();
        //console.log(`AveragePolicy visited ${this.historyLength} ${this.history.length}`)
        this.history.push(Date.now());
        if(this.historyLength < this.history.length)
            this.history.shift();
        console.log(this.history);
    }

    shouldRefresh(page){
        //console.log(`AveragePolicy shouldRefresh ${this.history.length} ${Date.now() - this.lastVisit} > ${this.millis}`)
        if((Date.now() - this.lastVisit) > this.millis){
            console.log(`AveragePolicy shouldRefresh by max time`);
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

        if( this.lastVisit + average < this.lastVisit + this.millis){
            console.log(`AveragePolicy shouldRefresh by average`);
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
