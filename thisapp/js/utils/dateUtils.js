/**
 * Created by roilandshut on 30/08/2017.
 */
import moment from 'moment';



import localizationFr from 'moment/locale/tr'
import localizationHe from 'moment/locale/he'
import localizationIt from 'moment/locale/it'
import localizationEs from 'moment/locale/es'
import localizationDe from 'moment/locale/de'
import localizationRu from 'moment/locale/ru'
import localizationEn from 'moment/locale/en-ie'
import strings from "../i18n/i18n"
const I18n = require('react-native-i18n');

const momentLocalization = {
    "en-US": localizationEn,
    en: localizationEn,
    he: localizationHe,
    'iw-IL':localizationHe ,
    'he-IL':localizationHe,
    it: localizationIt,
    fr: localizationFr,
    es: localizationEs,
    de: localizationDe,
    ru: localizationRu,
};

const localization = {
    "en-US": 'en',
    en: 'en',
    he: 'he',
    'iw-IL':'he' ,
    'he-IL':'he',
    it: 'it',
    fr: 'fr',
    es: 'es',
    de: 'de',
    ru: 'ru',
};
class DateUtils {
    messageFormater(itemDate) {
        let date = new Date(itemDate);
        moment.locale('al')
        let currentYear = new Date().getYear();
        let year = date.getYear();
        if (this.isToday(date)) {
            return moment(date).format('HH:mm');
        }
        let locale = I18n.default.locale
        if (this.isThisWeek(date)) {
            return strings.DateAtTime.formatUnicorn(moment(date).locale(localization[locale],momentLocalization[locale]).format('dddd'), moment(date).format('HH:mm'));
        }
        if (currentYear === year) {
            return strings.DateAtTime.formatUnicorn(moment(date).locale(localization[locale],momentLocalization[locale]).format('DD MMMM'), moment(date).format('HH:mm'));
        }
        return strings.DateAtTime.formatUnicorn(moment(date).locale(localization[locale],momentLocalization[locale]).format('DD MMMM YYYY'), moment(date).format('HH:mm'));
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