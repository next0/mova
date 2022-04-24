import { i18n as i18nBuilder, keyset, plurals, MovaLang } from 'mova-i18n';

const translates = keyset({
    '{count} item': {
        en: {
            one: '{count} item',
            other: '{count} items',
        },
        cs: {
            one: '',
            few: '',
            other: '',
        },
    },
});

export const i18n = i18nBuilder(process.env.LANG as MovaLang, plurals)(translates);
