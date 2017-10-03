/**
 * Created by roilandshut on 30/08/2017.
 */
import moment from 'moment';

class DateUtils {
    messageFormater(itemDate) {
        let date = new Date(itemDate);
        if (this.isToday(date)) {
            return moment(date).format('HH:m');
        }
        if (this.isThisWeek(date)) {
            return moment(date).format('dddd');
        }
        return moment(date).format('dd/MM/YYYY');
    }

    isToday(itemDate) {
        return moment(itemDate).isSame(moment(), 'day');
    }

    isThisWeek(date) {
        var now = moment();
        var input = moment(date);
        return (now.isoWeek() == input.isoWeek());
    }
}

export default DateUtils;