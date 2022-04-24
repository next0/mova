import type { MovaPlural } from 'types';

export interface MovaPluralTranslateG2 {
    /**
     * 0 -> zero
     */
    zero?: string;
    /**
     * 1 -> one
     */
    one: string;
    /**
     * 2 -> other
     */
    other: string;
}

type MovaPluralTranslateKeyG2 = keyof MovaPluralTranslateG2;

/**
 * 1 -> one
 * 2 -> other
 */
export const forms: MovaPluralTranslateKeyG2[] = ['one', 'other'];

export const plural: MovaPlural<MovaPluralTranslateKeyG2> = (n) => forms[n === 1 ? 0 : 1];
