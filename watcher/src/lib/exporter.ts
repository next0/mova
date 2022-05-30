import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { MovaWatcherConfig, MovaWatcherTranslatesStore, MovaWatcherInternalConfig } from 'types';
import { walkFiles } from 'lib/walkFiles';
import { parseCodeFile } from 'lib/parseCodeFile';
import { extractStoreTranslates } from 'lib/extractStoreTranslates';
import { MovaTranslates, MovaTranslateValue } from 'types';

function _log(filename: string, time: number): void {
    const message = [new Date().toISOString(), String(Math.round(time)).padStart(4) + 'ms', filename];

    console.log(message.join(' '));
}

async function _processFile(filename: string, config: MovaWatcherInternalConfig): Promise<MovaTranslates | undefined> {
    if (config.include && config.include.every((path) => !filename.startsWith(path))) {
        return;
    }

    if (config.exclude && config.exclude.some((path) => filename.startsWith(path))) {
        return;
    }

    if (filename.endsWith('.i18n.ts')) {
        const start = Date.now();

        const ast = await parseCodeFile(filename);
        const translates = extractStoreTranslates(ast);

        _log(filename, Date.now() - start);

        return translates;
    }
}

export async function exporter(config: MovaWatcherConfig): Promise<void> {
    const configText = await readFile(config.prettierConfigPath, 'utf-8');
    const prettierConfig = JSON.parse(configText);

    const internalConfig: MovaWatcherInternalConfig = {
        ...config,
        prettierConfig: { ...prettierConfig, parser: 'typescript' },
    };

    const dir = config.src;

    // initial processing
    const cache: MovaWatcherTranslatesStore = {};

    function isTranslatesEql(t1: MovaTranslateValue, t2: MovaTranslateValue): boolean {
        return JSON.stringify(t1) === JSON.stringify(t2);
    }

    for await (const filename of walkFiles(dir)) {
        const translates = await _processFile(filename, internalConfig);

        if (translates) {
            for (const key of Object.keys(translates)) {
                if (!cache[key]) {
                    cache[key] = [];
                }

                const cacheTranslates = cache[key].find((t) => isTranslatesEql(t.t, translates[key]));

                if (cacheTranslates) {
                    cacheTranslates.files.push(filename);
                } else {
                    cache[key].push({
                        files: [filename],
                        t: translates[key],
                    });
                }
            }
        }
    }

    // sort keys
    const keys = Object.keys(cache).sort((a, b) => a.localeCompare(b));
    const movaExport: MovaWatcherTranslatesStore = keys.reduce((memo: MovaWatcherTranslatesStore, key) => {
        const values = cache[key].map((item) => {
            if (item.files.length > 1) {
                return {
                    files: item.files.sort((a, b) => a.localeCompare(b)),
                    t: item.t,
                };
            }

            return item;
        });

        memo[key] = values.length > 1 ? values.sort((a, b) => b.files.length - a.files.length) : values;

        return memo;
    }, {});

    if (config.hooks && config.hooks.afterExport) {
        await config.hooks.afterExport(movaExport);
    } else {
        await writeFile(join(process.cwd(), 'mova-export.json'), JSON.stringify(movaExport, null, 2));
    }
}
