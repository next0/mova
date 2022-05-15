import { join } from 'node:path';
import { WatchOptions } from 'node:fs';
import { readFile, watch } from 'node:fs/promises';
import type { MovaWatcherConfig, MovaWatcherInternalConfig } from 'types';
import { processSourceFile } from 'lib/processSourceFile';
import { walkFiles } from 'lib/walkFiles';

function _log(event: string, filename: string, time: number, processed: boolean): void {
    const message = [
        new Date().toISOString(),
        ('[' + event + ']').padEnd(8),
        processed ? '↻' : '·',
        String(Math.round(time)).padStart(4) + 'ms',
        filename,
    ];

    console.log(message.join(' '));
}

async function _processFile(event: string, filename: string, config: MovaWatcherInternalConfig): Promise<void> {
    if (config.include && config.include.every((path) => !filename.startsWith(path))) {
        return;
    }

    if (config.exclude && config.exclude.some((path) => filename.startsWith(path))) {
        return;
    }

    if ((filename.endsWith('.ts') || filename.endsWith('.tsx')) && !filename.endsWith('.i18n.ts')) {
        const start = Date.now();
        const { sourceModified, storeModified } = await processSourceFile(filename, config);
        _log(event, filename, Date.now() - start, sourceModified || storeModified);
    }
}

export async function watcher(config: MovaWatcherConfig): Promise<void> {
    const configText = await readFile(config.prettierConfigPath, 'utf-8');
    const prettierConfig = JSON.parse(configText);

    const internalConfig: MovaWatcherInternalConfig = {
        ...config,
        prettierConfig: { ...prettierConfig, parser: 'typescript' },
    };

    const dir = config.src;

    // initial processing
    for await (const filename of walkFiles(dir)) {
        await _processFile('init', filename, internalConfig);
    }

    // watch and process changes
    const watchOpts: WatchOptions = {
        encoding: 'utf-8',
        persistent: true,
        recursive: true,
    };

    for await (const event of watch(dir, watchOpts)) {
        const { eventType } = event;
        const filename = join(dir, event.filename);

        if (eventType !== 'change') {
            continue;
        }

        await _processFile(eventType, filename, internalConfig);
    }
}
