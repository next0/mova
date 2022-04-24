import type { MovaPlural } from 'types';

export interface MovaPluralTranslateG4 {
    /**
     * 0 -> zero
     */
    zero?: string;
    /**
     * 1 -> one
     */
    one: string;
    /**
     * 2 -> few
     */
    few: string;
    /**
     * 5 -> many
     */
    many: string;
}

type MovaPluralTranslateKeyG4 = keyof MovaPluralTranslateG4;

/**
 * 1 -> one
 * 2 -> few
 * 5 -> many
 */
export const forms: MovaPluralTranslateKeyG4[] = ['one', 'few', 'many'];

export const plural: MovaPlural<MovaPluralTranslateKeyG4> = (n) =>
    forms[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
