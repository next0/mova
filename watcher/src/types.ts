import type { Options as PrettierConfig } from 'prettier';
import type { MovaLang, MovaPluralTranslateKey } from 'mova-i18n';

export type { MovaLang, MovaPluralTranslateKey } from 'mova-i18n';
export type MovaTranslate = string | Partial<Record<MovaPluralTranslateKey, string>>;
export type MovaTranslateValue = Partial<Record<MovaLang, MovaTranslate>>;
export type MovaTranslates<K extends string = string> = Record<K, MovaTranslateValue>;

export interface MovaWatcherConfig {
    lang: MovaLang;
    langs: MovaLang[];
    prettierConfigPath: string;
    src: string;
}

export interface MovaWatcherInternalConfig extends MovaWatcherConfig {
    prettierConfig: PrettierConfig;
}
