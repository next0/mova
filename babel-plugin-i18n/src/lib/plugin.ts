import type { PluginObj, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import { MovaProcessTranslate, processTranslates } from 'lib/processTranslates';
import { hash, HASH_PREFIX } from 'lib/hash';

export interface MovaBabelPluginOptions {
    lang?: string;
    fallbackLangs?: Record<string, string[]>;
    hashLen?: number;
}

export function plugin(): PluginObj<PluginPass & { opts: MovaBabelPluginOptions }> {
    const DEFAULT_HASH_LEN = 4;
    const DEFAULT_LANG = process.env.LANG || 'en';

    return {
        name: 'mova-babel-plugin-i18n',
        visitor: {
            // process.env.LANG -> opts.lang
            MemberExpression(path, state) {
                if (path.get('object').matchesPattern('process.env')) {
                    const node = path.node;

                    if (t.isIdentifier(node.property) && node.property.name === 'LANG') {
                        path.replaceWith(t.stringLiteral(state.opts.lang || DEFAULT_LANG));
                    }
                }
            },

            // store file
            VariableDeclarator(path, state) {
                const lang = state.opts.lang || DEFAULT_LANG;
                const fallbackLangs = state.opts.fallbackLangs || {};
                const hashLen = state.opts.hashLen || DEFAULT_HASH_LEN;

                const langPriorityList = [lang, ...(fallbackLangs[lang] || [])];

                if (state.filename.endsWith('.i18n.ts')) {
                    const node = path.node;

                    if (t.isIdentifier(node.id) && node.id.name === 'translates') {
                        const init = node.init;

                        const processOptions: MovaProcessTranslate = {
                            lang,
                            langPriorityList,
                            hashLen,
                        };

                        if (
                            t.isCallExpression(init) &&
                            t.isIdentifier(init.callee) &&
                            init.callee.name === 'keyset' &&
                            init.arguments.length &&
                            t.isObjectExpression(init.arguments[0])
                        ) {
                            // parse case: `const translates = keyset({ ... });`
                            processTranslates(init.arguments[0], processOptions);
                        } else if (t.isObjectExpression(init)) {
                            // parse case: `const translates = { ... };`
                            processTranslates(init, processOptions);
                        }
                    }
                }
            },

            // source file
            ImportDeclaration(path, state) {
                if (!state.filename.endsWith('.i18n.ts')) {
                    const node = path.node;
                    const importPath = node.source.value;

                    if (importPath.endsWith('.i18n')) {
                        const specs = node.specifiers;
                        const spec: t.ImportSpecifier | undefined =
                            specs.length === 1 && t.isImportSpecifier(specs[0]) ? specs[0] : undefined;

                        if (spec && spec.imported && t.isIdentifier(spec.imported) && spec.imported.name === 'i18n') {
                            // import { i18n } from 'path/to/Component/Component.i18n';
                            this._movaTransformationEnabled = true;
                        }
                    }
                }
            },
            CallExpression(path, state) {
                const hashLen = state.opts.hashLen || 4;

                if (!state.filename.endsWith('.i18n.ts') && this._movaTransformationEnabled) {
                    const node = path.node;

                    if (t.isIdentifier(node.callee) && node.callee.name === 'i18n') {
                        if (node.arguments.length && t.isStringLiteral(node.arguments[0])) {
                            const value = node.arguments[0].value;

                            // don't apply mutation to hashed value
                            if (!value.startsWith(HASH_PREFIX)) {
                                node.arguments[0].value = hash(value, hashLen);
                            }
                        }
                    }
                }
            },
        },
    };
}
