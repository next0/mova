import type { Options as PrettierConfig } from 'prettier';
import type { MovaLang, MovaPluralTranslateKey, MovaTranslateMeta } from 'mova-i18n';

export type { MovaLang, MovaPluralTranslateKey, MovaTranslateMeta } from 'mova-i18n';
export type MovaTranslate = string | Partial<Record<MovaPluralTranslateKey, string>>;
export type MovaTranslateValue = Partial<Record<MovaLang, MovaTranslate>> & { _meta?: MovaTranslateMeta };
export type MovaTranslates<K extends string = string> = Record<K, MovaTranslateValue>;

export type MovaWatcherTranslatesStore = Record<
    string,
    Array<{
        files: string[];
        t: MovaTranslateValue;
    }>
>;

export interface MovaWatcherConfig {
    lang: MovaLang;
    langs: MovaLang[];
    prettierConfigPath: string;
    src: string;
    include?: string[];
    exclude?: string[];

    hooks?: {
        afterExport?(payload: MovaWatcherTranslatesStore): Promise<void>;
        beforeImport?(): Promise<MovaWatcherTranslatesStore>;
    };
}

export interface MovaWatcherInternalConfig extends MovaWatcherConfig {
    prettierConfig: PrettierConfig;
}
