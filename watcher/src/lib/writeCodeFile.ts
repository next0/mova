import { writeFile } from 'node:fs/promises';
import { format, Options as PrettierConfig } from 'prettier';

export async function writeCodeFile(filePath: string, code: string, prettierConfig: PrettierConfig): Promise<void> {
    await writeFile(filePath, format(code, prettierConfig), 'utf-8');
}
