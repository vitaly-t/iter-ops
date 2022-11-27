import {$A, AsyncOperation} from '../../types';
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
export function page<T>(size: number): AsyncOperation<T, T[]> {
    return (iterable) => ({
        [$A](): AsyncIterator<T[]> {
            if (typeof size !== 'number' || size < 1) {
                return iterateOnce(false, () => {
                    throw new TypeError(
                        `Page size >= 1 is required: ${JSON.stringify(size)}`
                    );
                }) as any;
            }
            const i = iterable[$A]();
            return {
                next(): Promise<IteratorResult<T[]>> {
                    const value: T[] = [];
                    let c = 0;
                    const nextValue = (): any =>
                        i.next().then((a) => {
                            if (a.done) {
                                return value.length ? {value, done: false} : a;
                            }
                            value.push(a.value);
                            return ++c < size
                                ? nextValue()
                                : {value, done: false};
                        });
                    return nextValue();
                },
            };
        },
    });
}
