export default {
    lang: 'en',
    langs: ['en', 'cs'],
    prettierConfigPath: '.prettierrc.json',
    src: 'examples',
    hooks: {
        afterExport(store) {
            console.log(store);
        },
    },
};
