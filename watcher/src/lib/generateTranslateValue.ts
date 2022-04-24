import { forms } from 'mova-i18n';
import type { MovaLang, MovaTranslateValue, MovaTranslate, MovaWatcherInternalConfig } from 'types';

function _generatePluralValue(text: string, lang: MovaLang): MovaTranslate | undefined {
    if (forms[lang]) {
        return forms[lang].reduce((memo, name) => {
            memo[name] = text;

            return memo;
        }, {});
    }
}

export function generateTranslateValue(text: string, config: MovaWatcherInternalConfig): MovaTranslateValue {
    const isPlural = text.includes('{count}');

    return config.langs.reduce((memo, lang) => {
        const value = lang === config.lang ? text : '';

        memo[lang] = isPlural ? _generatePluralValue(value, lang) : value;

        return memo;
    }, {});
}
