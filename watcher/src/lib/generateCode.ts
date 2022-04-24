import generate from '@babel/generator';
import * as t from '@babel/types';
import { cjs } from 'lib/cjs';

export function generateCode(ast: t.Node): string {
    return cjs(generate)(ast, { retainLines: true, jsonCompatibleStrings: false }).code;
}
