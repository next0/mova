function i18n(text: string): string {
    return 'i18n: ' + text;
}

export function counter() {
    let count = 0;

    return () => i18n('hi');
}
