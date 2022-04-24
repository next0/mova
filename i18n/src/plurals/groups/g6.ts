import type { MovaPlural } from 'types';

export interface MovaPluralTranslateG6 {
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
     * 5 -> other
     */
    other: string;
}

type MovaPluralTranslateKeyG6 = keyof MovaPluralTranslateG6;

/**
 * 1 -> one
 * 2 -> few
 * 5 -> other
 */
export const forms: MovaPluralTranslateKeyG6[] = ['one', 'few', 'other'];

export const plural: MovaPlural<MovaPluralTranslateKeyG6> = (n) => forms[n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2];
