import type { MovaLang, MovaPlural, MovaPlurals, MovaTranslates, MovaPluralTranslateKey } from 'types';
import { MovaTokenizeTokens, tokenize } from 'lib/tokenize';

function _nativePlural(lang: MovaLang): MovaPlural<MovaPluralTranslateKey> | undefined {
    try {
        const rules = new Intl.PluralRules(lang);
        rules.resolvedOptions();
        return (count: number) => rules.select(count);
    } catch (error) {
        // noop
    }
}

export function i18n(lang: MovaLang, plurals?: MovaPlurals) {
    const plural = _nativePlural(lang) || plurals[lang];

    if (!plural) {
        throw new Error('mova-i18n plurals not configured properly');
    }

    return function keyset<T extends MovaTranslates>(translates: T) {
        const cache: Partial<Record<string, MovaTokenizeTokens>> = {};

        function translate(key: keyof T, params?: Record<string, any>): Array<string | any> {
            const keyTranslates = translates[key] ? translates[key][lang] : undefined;
            let translate: string;
            let tokens: MovaTokenizeTokens;

            if (!keyTranslates) {
                // no translations
                return [''];
            }

            if (typeof keyTranslates === 'string') {
                // singular
                translate = keyTranslates;
            } else {
                // plural
                let count: number = 1;

                if (params !== undefined) {
                    if (typeof params._count === 'number') {
                        count = params._count;
                    } else if (typeof params.count === 'number') {
                        count = params.count;
                    }
                }

                if (count === 0 && keyTranslates.hasOwnProperty('zero')) {
                    translate = keyTranslates.zero;
                } else {
                    translate = keyTranslates[plural(count)] || keyTranslates.one || '';
                }
            }

            if (cache.hasOwnProperty(translate)) {
                tokens = cache[translate];
            } else {
                tokens = tokenize(translate);
                cache[translate] = tokens;
            }

            return tokens.map((token) => {
                if (Array.isArray(token)) {
                    // ref token
                    const ref = token[0];
                    return params !== undefined && params.hasOwnProperty(ref) ? params[ref] : '';
                }

                // text token
                return token;
            });
        }

        function t(key: keyof T, params?: Record<string, any>): string;
        function t(key: keyof T, params?: Record<string, any>, mod?: { __raw__: true }): Array<string | any>;
        function t(key: keyof T, params?: Record<string, any>, mod?: { __raw__: true }): string | Array<string | any> {
            const res = translate(key, params);
            return mod && mod.__raw__ === true ? res : res.join('');
        }

        return t;
    };
}
