/**
 * Created by roilandshut on 30/08/2017.
 */
import moment from 'moment';
import strings from "../i18n/i18n"

const I18n = require('react-native-i18n');

class DateUtils {
    messageFormater(itemDate) {
        //moment.locale(I18n.default.locale);
        let date = new Date(itemDate);
        let currentYear = new Date().getYear();
        let year = date.getYear();
        if (this.isToday(date)) {
            return moment(date).format('HH:mm');
        }
        if (this.isThisWeek(date)) {
            return strings.DateAtTime.formatUnicorn(this.localize(moment(date).format('dddd'), moment(date).format('dddd')), moment(date).format('HH:mm'));
        }
        if (currentYear === year) {
            return strings.DateAtTime.formatUnicorn(this.localize(moment(date).format('MMMM'), moment(date).format('DD MMMM')), moment(date).format('HH:mm'));
        }
        return strings.DateAtTime.formatUnicorn(this.localize(moment(date).format('MMMM'), moment(date).format('DD MMMM YYYY')), moment(date).format('HH:mm'));
    }

    localize(string, toLocale) {
        switch (string) {
            case 'Sunday':
                return toLocale.replace(string, strings.Sunday)
            case 'Monday':
                return toLocale.replace(string, strings.Monday)
            case 'Tuesday':
                return toLocale.replace(string, strings.Tuesday)
            case 'Wednesday':
                return toLocale.replace(string, strings.Wednesday)
            case 'Thursday':
                return toLocale.replace(string, strings.Thursday)
            case 'Friday':
                return toLocale.replace(string, strings.Friday)
            case 'Saturday':
                return toLocale.replace(string, strings.Friday)
            case 'January':
                return toLocale.replace(string, strings.January)
            case 'February':
                return toLocale.replace(string, strings.February)
            case 'March':
                return toLocale.replace(string, strings.March)
            case 'April':
                return toLocale.replace(string, strings.April)
            case 'May':
                return toLocale.replace(string, strings.May)
            case 'June':
                return toLocale.replace(string, strings.June)
            case 'July':
                return toLocale.replace(string, strings.July)
            case 'August':
                return toLocale.replace(string, strings.August)
            case 'September':
                return toLocale.replace(string, strings.September)
            case 'October':
                return toLocale.replace(string, strings.October)
            case 'November':
                return toLocale.replace(string, strings.November)
            case 'December':
                return toLocale.replace(string, strings.December)
        }
        return toLocale;
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