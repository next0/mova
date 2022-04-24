import typescript from '@rollup/plugin-typescript';
import tsTransformPaths from '@zerollup/ts-transform-paths';

function buildPlugins(outDir) {
    return [
        typescript({
            outDir,
            transformers: {
                before: [
                    {
                        type: 'program',
                        factory: (program) => {
                            const transformer = tsTransformPaths(program);

                            return transformer.before;
                        },
                    },
                ],
                afterDeclarations: [
                    {
                        type: 'program',
                        factory: (program) => {
                            const transformer = tsTransformPaths(program);

                            return transformer.afterDeclarations;
                        },
                    },
                ],
            },
        }),
    ];
}

export default {
    input: 'src/index.ts',
    output: [
        // types + cjs
        {
            dir: 'dist',
            format: 'cjs',
        },
        // esm
        {
            file: 'dist/index.mjs',
            format: 'esm',
        },
    ],
    plugins: buildPlugins('dist'),
};
