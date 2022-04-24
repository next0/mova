function _isDefaultExport<T>(obj: T | { default: T }): obj is { default: T } {
    return obj.hasOwnProperty('default');
}

export function cjs<T>(obj: T | { default: T }): T {
    return _isDefaultExport(obj) ? obj.default : obj;
}
