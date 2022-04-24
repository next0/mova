import { createHash } from 'node:crypto';

export const HASH_PREFIX = '$';

export function hash(str: string, len: number = 4): string {
    return HASH_PREFIX + createHash('sha1').update(str).digest('hex').slice(0, len);
}
