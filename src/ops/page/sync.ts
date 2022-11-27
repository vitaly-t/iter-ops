import {$S, SyncOperation} from '../../types';
import {iterateOnce} from '../../utils';

/**
 * Splits values into pages of fixed size (last page can be smaller).
 *
 * ```ts
 * import {pipe, page} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     page(2)
 * );
 *
 * console.log(...i); //=> [1, 2], [3, 4], [5]
 * ```
 *
 * @throws `TypeError: 'Page size >= 1 is required: ...'` when `size` is less than 1 or not a `number`.
 *
 * @see
 *  - {@link split}
 * @category Operations
 */
export function page<T>(size: number): SyncOperation<T, T[]> {
    return (iterable) => ({
        [$S](): Iterator<T[]> {
            if (typeof size !== 'number' || size < 1) {
                return iterateOnce(true, () => {
                    throw new TypeError(
                        `Page size >= 1 is required: ${JSON.stringify(size)}`
                    );
                }) as any;
            }
            const i = iterable[$S]();
            return {
                next(): IteratorResult<T[]> {
                    const value = [];
                    let a,
                        c = 0;
                    while (c++ < size && !(a = i.next()).done) {
                        value.push(a.value);
                    }
                    if (value.length) {
                        return {value, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
