import { i18n } from './counter.i18n';

export function counter() {
    let count = 0;

    if (process.env.LANG === 'en') {
        count = 1;
    }

    return () => i18n('hi') + ':' + i18n('{count} item', { count: count++ });
}
