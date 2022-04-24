import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import * as t from '@babel/types';
import { parse } from '@babel/parser';

export async function parseCodeFile(filePath: string): Promise<t.File | null> {
    try {
        await access(filePath, constants.R_OK | constants.W_OK);

        const code = await readFile(filePath, 'utf-8');

        return parse(code, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });
    } catch (error) {
        return null;
    }
}
