import { MovaTranslates } from 'types';

export function keyset<T extends MovaTranslates>(translates: T): T {
    return translates;
}
