import {$S, SyncOperation} from '../../types';

/**
 * Emits unique values, with optional key selector.
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 1, 1, 2, 2, 2, 3, 3],
 *     distinct() // selector not needed for simple types
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * With optional selector function:
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [{a: 1}, {a: 1}, {a: 2}, {a: 2}],
 *     distinct(v => v.a)
 * );
 *
 * console.log(...i); //=> {a: 1}, {a: 2}
 * ```
 *
 * @category Operations
 */
export function distinct<T, K>(
    keySelector?: (value: T, index: number) => K
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const ks = typeof keySelector === 'function' && keySelector;
            const keySet = new Set();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            const key = ks ? ks(a.value, index++) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    keySet.clear(); // for better memory management
                    return a;
                },
            };
        },
    });
}
