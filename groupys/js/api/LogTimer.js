/**
 * Created by roilandshut on 12/07/2017.
 */

class LogTimer {


    logTime(fromDate,toDate,entity,api){
        let totalTime = toDate.getMilliseconds() + fromDate.getMilliseconds();


        console.log(entity +' Api: ' + api + ' took: '+ totalTime + ' milliseconds')
    }

}
export default LogTimer;