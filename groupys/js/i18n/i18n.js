import LocalizedStrings from 'react-native-localization';
import enUS from './enUS';
import fr from './fr';
import it from './it';
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
    fr: fr,
    es: es,
    de: de,
    ru: ru,
});
export default strings;