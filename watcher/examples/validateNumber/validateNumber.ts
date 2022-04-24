import { i18n } from './validateNumber.i18n';

export type Optional<T> = T | undefined;

export interface FormError {
    code: string;
    message: string;
}

export type FormErrorSchema = Array<FormError>;

export function validateNumber<T>({ min, max }: { min?: number; max?: number }) {
    return (value: Optional<T>): Optional<FormErrorSchema> => {
        if (value) {
            const num = Number(value);

            if (!num || isNaN(num)) {
                return [{ message: i18n('Value must be a number'), code: 'should_number' }];
            }

            if (min !== undefined && max !== undefined) {
                if (num < min || num > max) {
                    return [
                        {
                            message: i18n('Value must be between {min} and {max}', { min, max }),
                            code: 'should_between',
                        },
                    ];
                }
            } else if (min !== undefined) {
                if (num < min) {
                    return [{ message: i18n('Value must be more then {min}', { min }), code: 'should_more' }];
                }
            } else if (max !== undefined) {
                if (num > max) {
                    return [{ message: i18n('Value must be less then {max}', { max }), code: 'should_less' }];
                }
            }
        }

        return undefined;
    };
}
