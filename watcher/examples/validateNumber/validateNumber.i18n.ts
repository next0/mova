import { i18n as i18nBuilder, keyset, plurals, MovaLang } from 'mova-i18n';

const translates = keyset({
    'Value must be a number': {
        en: 'Value must be a number',
        cs: '',
    },
    'Value must be between {min} and {max}': {
        en: 'Value must be between {min} and {max}',
        cs: '',
    },
    'Value must be less then {max}': {
        en: 'Value must be less then {max}',
        cs: '',
    },
    'Value must be more then {min}': {
        en: 'Value must be more then {min}',
        cs: '',
    },
});

export const i18n = i18nBuilder(process.env.LANG as MovaLang, plurals)(translates);
