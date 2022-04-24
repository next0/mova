import * as t from '@babel/types';
import { hash, HASH_PREFIX } from 'lib/hash';

export interface MovaProcessTranslate {
    lang: string;
    langPriorityList: string[];
    hashLen: number;
}

function getObjectPropertyValue(prop: t.Node): string | undefined {
    if (t.isObjectProperty(prop) && (t.isIdentifier(prop.key) || t.isStringLiteral(prop.key))) {
        return t.isIdentifier(prop.key) ? prop.key.name : prop.key.value;
    }

    return undefined;
}

function hasTranslatedValue(prop: t.ObjectProperty | undefined): boolean {
    if (!prop) {
        return false;
    }

    const node = prop.value;

    if (t.isStringLiteral(node)) {
        return Boolean(node.value);
    } else if (t.isObjectExpression(node)) {
        return node.properties.some((prop) => Boolean(getObjectPropertyValue(prop)));
    }

    return false;
}

export function processTranslates(node: t.ObjectExpression, options: MovaProcessTranslate): void {
    const { lang, langPriorityList, hashLen } = options;

    return node.properties.forEach((prop) => {
        const keyName = getObjectPropertyValue(prop);

        if (
            t.isObjectProperty(prop) &&
            t.isObjectExpression(prop.value) &&
            keyName &&
            // don't apply mutation to hashed value
            !keyName.startsWith(HASH_PREFIX)
        ) {
            prop.key = t.identifier(hash(keyName, hashLen));

            // leave only one target language
            const cache = new Map<string, t.ObjectProperty>();

            for (const langProp of prop.value.properties) {
                const langPropName = getObjectPropertyValue(langProp);

                if (t.isObjectProperty(langProp) && langPropName) {
                    cache.set(langPropName, langProp);
                }
            }

            let langProp: t.ObjectProperty | undefined;

            for (const lang of langPriorityList) {
                const currentLangProp = cache.get(lang);

                if (hasTranslatedValue(currentLangProp)) {
                    langProp = currentLangProp;
                    break;
                }
            }

            prop.value.properties = langProp ? [t.objectProperty(t.identifier(lang), langProp.value)] : [];
        }
    });
}
