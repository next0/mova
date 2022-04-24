import { MovaTranslates } from 'types';

export function defaultStoreTemplate(translates: MovaTranslates): string {
    return `
import { i18n as i18nBuilder, keyset, plurals, MovaLang } from 'mova-i18n';

const translates = keyset(${JSON.stringify(translates, null, 4)});

export const i18n = i18nBuilder(process.env.LANG as MovaLang, plurals)(translates);
`.trim();
}
