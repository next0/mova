import { i18n as i18nBuilder, keyset, plurals, MovaLang } from 'mova-i18n';

const translates = keyset({
    hi: {
        en: 'hi',
        cs: '???',
    },
    user: {
        en: 'User',
        cs: '???',
    },
    '{count} item': {
        en: {
            one: '{count} item',
            other: '{count} items',
        },
        cs: {
            one: '{count} ???',
            few: '{count} ???',
            other: '{count} ???',
        },
    },
});

export const i18n = i18nBuilder(process.env.LANG as MovaLang, plurals)(translates);
