import { constants } from 'node:fs';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { watcher } from 'lib/watcher';
import { MovaWatcherConfig } from 'types';

const BASE_DIR = process.cwd();

async function run(): Promise<void> {
    const configPath = join(BASE_DIR, 'mova.config.json');

    try {
        await access(configPath, constants.R_OK);
    } catch (error) {
        console.error('no mova.config.json was found');
        process.exit(1);
        return;
    }

    const configText = await readFile(configPath, 'utf-8');
    const config: MovaWatcherConfig = JSON.parse(configText);

    await watcher(config);
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
