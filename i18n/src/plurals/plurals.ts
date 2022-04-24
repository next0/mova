import type { MovaPlurals } from 'types';
import { plural as en } from 'plurals/langs/en';
import { plural as be } from 'plurals/langs/be';
import { plural as ru } from 'plurals/langs/ru';
import { plural as cs } from 'plurals/langs/cs';

/**
 * https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html
 */
export const plurals: MovaPlurals = {
    en,
    be,
    ru,
    cs,
};
