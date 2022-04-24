import * as t from '@babel/types';
import type { MovaTranslates } from 'types';
import traverse from '@babel/traverse';
import { cjs } from 'lib/cjs';

function ast2obj(node: t.ObjectExpression): Record<string, any> {
    return node.properties.reduce((memo, prop) => {
        if (t.isObjectProperty(prop) && (t.isIdentifier(prop.key) || t.isStringLiteral(prop.key))) {
            const key = t.isIdentifier(prop.key) ? prop.key.name : prop.key.value;

            if (t.isStringLiteral(prop.value)) {
                memo[key] = prop.value.value;
            } else if (t.isObjectExpression(prop.value)) {
                memo[key] = ast2obj(prop.value);
            }
        }

        return memo;
    }, {});
}

export function extractStoreTranslates(ast: t.File | null): MovaTranslates {
    let translates: MovaTranslates = {};

    cjs(traverse)(ast, {
        VariableDeclarator(path) {
            const node = path.node;

            if (t.isIdentifier(node.id) && node.id.name === 'translates') {
                const init = node.init;

                if (
                    t.isCallExpression(init) &&
                    t.isIdentifier(init.callee) &&
                    init.callee.name === 'keyset' &&
                    init.arguments.length &&
                    t.isObjectExpression(init.arguments[0])
                ) {
                    // parse case: `const translates = keyset({ ... });`
                    translates = ast2obj(init.arguments[0]) as MovaTranslates;
                } else if (t.isObjectExpression(init)) {
                    // parse case: `const translates = { ... };`
                    translates = ast2obj(init) as MovaTranslates;
                }
            }
        },
    });

    return translates;
}
