/**
 * Created by roilandshut on 30/08/2017.
 */
import moment from 'moment';
import strings from "../i18n/i18n"

class DateUtils {
    messageFormater(itemDate) {
        let date = new Date(itemDate);
        let currentYear = new Date().getYear();
        let year = date.getYear();
        if (this.isToday(date)) {
            return moment(date).format('HH:mm');
        }
        if (this.isThisWeek(date)) {
            return strings.DateAtTime.formatUnicorn(moment(date).format('dddd'), moment(date).format('HH:mm'));
        }
        if (currentYear === year) {
            return strings.DateAtTime.formatUnicorn(moment(date).format('DD MMMM'), moment(date).format('HH:mm'));
        }
        return strings.DateAtTime.formatUnicorn(moment(date).format('DD MMMM YYYY'), moment(date).format('HH:mm'));
    }

    isToday(itemDate) {
        return moment(itemDate).isSame(moment(), 'day');
    }

    isThisWeek(date) {
        var now = moment();
        var input = moment(date);
        return (now.isoWeek() === input.isoWeek());
    }
}

export default DateUtils;