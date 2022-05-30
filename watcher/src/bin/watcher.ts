import { constants } from 'node:fs';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { exporter } from 'lib/exporter';
import { watcher } from 'lib/watcher';
import { MovaWatcherConfig } from 'types';

const BASE_DIR = process.cwd();

async function parseConfigCode(): Promise<MovaWatcherConfig> {
    const configPath = join(BASE_DIR, 'mova.config.js');
    await access(configPath, constants.R_OK);
    const configModule = await import(configPath);

    return configModule && configModule.default ? configModule.default : configModule;
}

async function parseConfigJson(): Promise<MovaWatcherConfig> {
    const configPath = join(BASE_DIR, 'mova.config.json');
    await access(configPath, constants.R_OK);
    const configText = await readFile(configPath, 'utf-8');

    return JSON.parse(configText) as MovaWatcherConfig;
}

async function parseConfig(): Promise<MovaWatcherConfig> {
    try {
        return await parseConfigJson();
    } catch (e) {
        return parseConfigCode();
    }
}

async function run(): Promise<void> {
    let config: MovaWatcherConfig;

    try {
        config = await parseConfig();
    } catch (error) {
        console.error('no mova.config.json was found');
        process.exit(1);
        return;
    }

    if (process.argv[2] === 'export') {
        await exporter(config);
    } else {
        await watcher(config);
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
