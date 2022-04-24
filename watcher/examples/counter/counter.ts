import { i18n } from './counter.i18n';

export function counter() {
    let count = 0;

    return () => i18n('{count} item', { count: count++ });
}
