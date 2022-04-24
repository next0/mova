import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function* walkFiles(dir: string): AsyncIterable<string> {
    let files = await readdir(dir);

    for (let file of files) {
        let pathname = join(dir, file);
        let fileStat = await stat(pathname);

        if (fileStat.isDirectory()) {
            yield* walkFiles(pathname);
        } else {
            yield pathname;
        }
    }
}
