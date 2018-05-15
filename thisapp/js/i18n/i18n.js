//for list of locales please refer to the following link:
// https://gist.github.com/ndbroadbent/588fefab8e0f1b459fcec8181b41b39c
import LocalizedStrings from 'react-native-localization';
import enUS from './enUS';
import fr from './fr';
import it from './it';
import ar from './ar';
import il from './il';
import es from './es';
import de from './de';
import ru from './ru';

let strings = new LocalizedStrings({
    "en-US": enUS,
    en: enUS,
    he: il,
    'iw-IL':il ,
    'he-IL':il,
    it: it,
    ar: ar,
    fr: fr,
    es: es,
    de: de,
    ru: ru,
});
export default strings;