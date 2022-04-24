import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { cjs } from 'lib/cjs';

export interface ExtractSourceTranslatesResult {
    readonly enabled: boolean;
    readonly translates: Set<string>;
    readonly i18nCallExpressionList: t.CallExpression[];
}

export function extractSourceTranslates(ast: t.File | null): ExtractSourceTranslatesResult {
    let enabled = false;

    const i18nCallExpressionList: t.CallExpression[] = [];
    const translates = new Set<string>();

    cjs(traverse)(ast, {
        ImportDeclaration(path) {
            const node = path.node;
            const importPath = node.source.value;

            if (importPath.endsWith('.i18n')) {
                enabled = true;
            }
        },
        CallExpression(path) {
            const node = path.node;

            if (t.isIdentifier(node.callee) && node.callee.name === 'i18n') {
                if (node.arguments.length && t.isStringLiteral(node.arguments[0])) {
                    translates.add(node.arguments[0].value);
                    i18nCallExpressionList.push(node);
                } else {
                    // warn
                }
            }
        },
    });

    return {
        enabled,
        translates,
        i18nCallExpressionList,
    };
}
