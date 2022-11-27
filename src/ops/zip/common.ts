import type {UnknownIterator} from '../../types';
import {iterateOnce} from '../../utils';

export function validateZipIterators<T>(
    sync: boolean,
    inputs: UnknownIterator<T>[]
) {
    for (let i = 1; i < inputs.length; i++) {
        const a = inputs[i];
        if (!a || typeof a.next !== 'function') {
            return iterateOnce(sync, () => {
                // either not iterable, or async iterable passed inside synchronous pipeline;
                throw new TypeError(
                    `Value at index ${i - 1} is not iterable: ${JSON.stringify(
                        a
                    )}`
                );
            }) as any;
        }
    }
}
