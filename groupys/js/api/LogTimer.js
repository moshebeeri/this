class LogTimer {
    logTime(fromDate, toDate, entity, api) {
        let totalTime = toDate.getMilliseconds() + fromDate.getMilliseconds();
        console.log(entity + ' Api: ' + api + ' took: ' + totalTime + ' milliseconds')
    }
}

export default LogTimer;