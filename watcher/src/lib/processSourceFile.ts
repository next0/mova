import { parseCodeFile } from 'lib/parseCodeFile';
import { extractSourceTranslates } from 'lib/extractSourceTranslates';
import { extractStoreTranslates } from 'lib/extractStoreTranslates';
import type { MovaTranslates, MovaTranslateValue, MovaWatcherInternalConfig } from 'types';
import * as t from '@babel/types';
import { writeCodeFile } from 'lib/writeCodeFile';
import { generateCode } from 'lib/generateCode';
import { generateTranslateValue } from 'lib/generateTranslateValue';
import { defaultStoreTemplate } from 'lib/defaultStoreTemplate';

export interface MovaProcessSourceFileResult {
    sourceModified: boolean;
    storeModified: boolean;
}

export async function processSourceFile(
    sourceFilePath: string,
    config: MovaWatcherInternalConfig,
): Promise<MovaProcessSourceFileResult> {
    const storeFilePath = sourceFilePath.replace(/\.tsx?$/, '.i18n.ts');

    const [sourceAst, storeAst] = await Promise.all([parseCodeFile(sourceFilePath), parseCodeFile(storeFilePath)]);

    const { enabled, translates: sourceTranslates, i18nCallExpressionList } = extractSourceTranslates(sourceAst);

    let sourceModified = false;
    let storeModified = false;

    if (enabled) {
        const storeTranslates = extractStoreTranslates(storeAst);
        const nextTranslates: [string, MovaTranslateValue][] = [];

        for (const key of Object.keys(storeTranslates)) {
            if (!sourceTranslates.has(key)) {
                // remove no more actual keys from store
                storeModified = true;
                continue;
            }

            const value = storeTranslates[key];
            const baseValue = value[config.lang];

            if (baseValue) {
                const keyBaseValue = typeof baseValue === 'string' ? baseValue : baseValue.one;

                if (keyBaseValue !== key) {
                    // replace keys in store and source code
                    nextTranslates.push([keyBaseValue, value]);

                    for (const node of i18nCallExpressionList) {
                        if (t.isStringLiteral(node.arguments[0]) && node.arguments[0].value === key) {
                            node.arguments[0].value = keyBaseValue;
                        }
                    }

                    sourceModified = true;
                    storeModified = true;
                } else {
                    nextTranslates.push([key, value]);
                }
            }
        }

        // add new translates from code to store
        for (const key of sourceTranslates.values()) {
            if (!storeTranslates.hasOwnProperty(key)) {
                nextTranslates.push([key, generateTranslateValue(key, config)]);
                storeModified = true;
            }
        }

        // apply modifications
        if (sourceModified) {
            await writeCodeFile(sourceFilePath, generateCode(sourceAst), config.prettierConfig);
        }

        if (storeModified) {
            const translates = nextTranslates
                .sort((a, b) => {
                    return a[0].localeCompare(b[0]);
                })
                .reduce((memo: MovaTranslates, [key, value]) => {
                    memo[key] = value;
                    return memo;
                }, {});

            const content = defaultStoreTemplate(translates);

            await writeCodeFile(storeFilePath, content, config.prettierConfig);
        }
    }

    return { sourceModified, storeModified };
}
