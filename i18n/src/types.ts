import type { MovaPluralTranslateLangBe } from 'plurals/langs/be';
import type { MovaPluralTranslateLangCs } from 'plurals/langs/cs';
import type { MovaPluralTranslateLangRu } from 'plurals/langs/ru';
import type { MovaPluralTranslateLangEn } from 'plurals/langs/en';

export type MovaLang = 'en' | 'be' | 'cs' | 'ru';

export type MovaPluralTranslateKey = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type MovaTranslate<T> = string | T;

export type MovaTranslateMeta = Partial<Record<string, any>> & { context?: string };

export type MovaTranslates<K extends string = string> = Record<
    K,
    Partial<{
        _meta: MovaTranslateMeta;
        en: MovaTranslate<MovaPluralTranslateLangEn>;
        be: MovaTranslate<MovaPluralTranslateLangBe>;
        ru: MovaTranslate<MovaPluralTranslateLangRu>;
        cs: MovaTranslate<MovaPluralTranslateLangCs>;
    }>
>;

export type MovaPlural<K extends MovaPluralTranslateKey> = (count: number) => K;

export type MovaPlurals = Partial<{
    en: MovaPlural<keyof MovaPluralTranslateLangEn>;
    be: MovaPlural<keyof MovaPluralTranslateLangBe>;
    ru: MovaPlural<keyof MovaPluralTranslateLangRu>;
    cs: MovaPlural<keyof MovaPluralTranslateLangCs>;
}>;
