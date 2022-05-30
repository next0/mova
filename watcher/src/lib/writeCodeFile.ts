import { writeFile } from 'node:fs/promises';
import type { Options as PrettierConfig } from 'prettier';
import prettier from 'prettier';

const { format } = prettier;

export async function writeCodeFile(filePath: string, code: string, prettierConfig: PrettierConfig): Promise<void> {
    await writeFile(filePath, format(code, prettierConfig), 'utf-8');
}
