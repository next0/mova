export type MovaTextToken = string;
export type MovaRefToken = [string];
export type MovaTokenizeTokens = Array<MovaTextToken | MovaRefToken>;

export function tokenize(template: string): MovaTokenizeTokens {
    const tokens: MovaTokenizeTokens = [];
    let valid = true;
    let prev = 0;
    let open = 0;

    for (let cur = 0; cur < template.length; cur++) {
        if (template[cur] === '{') {
            open += 1;

            if (open > 1) {
                valid = false;
                break;
            }

            if (prev !== cur) {
                // text token
                tokens.push(template.slice(prev, cur));
            }

            prev = cur + 1;
        } else if (template[cur] === '}') {
            open -= 1;

            if (open < 0 || prev === cur) {
                valid = false;
                break;
            }

            // ref token
            tokens.push([template.slice(prev, cur)]);
            prev = cur + 1;
        }
    }

    if (!valid) {
        return [template];
    }

    if (prev < template.length) {
        // last text token
        tokens.push(template.slice(prev, template.length));
    }

    return tokens;
}
