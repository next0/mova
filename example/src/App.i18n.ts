import { i18n as i18nBuilder, keyset, plurals, MovaLang } from 'mova-i18n';

const translates = keyset({
    'Hello world!': {
        _meta: {
            context: 'Hero element message',
        },
        en: 'Hello world!',
        be: 'Прывітанне!',
    },
});

export const i18n = i18nBuilder(process.env.LANG as MovaLang, plurals)(translates);
