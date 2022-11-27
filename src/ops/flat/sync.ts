import {$S, SyncOperation} from '../../types';
import type {FlattenSync} from '../../types/utils';

/**
 * Expands / flattens sub-iterables up to the specified `depth` (default is 1).
 *
 * ```ts
 * import {pipe, flat} from 'iter-ops';
 *
 * const i = pipe(
 *     ['one', [2, 3, [4, 5]]],
 *     flat(2)
 * );
 *
 * console.log(...i); //=> 'o', 'n', 'e', 2, 3, 4, 5
 * ```
 *
 * It implements the logic consistent with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()},
 * handling non-iterable values without throwing errors (unlike {@link spread}), and with optional `depth` support.
 *
 * Compare it to a more strict {@link spread} operator.
 *
 * @see
 *  - {@link spread}
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()}
 * @category Operations
 */
export function flat<T, N extends number = 1>(
    depth: N = 1 as N
): SyncOperation<T, FlattenSync<T, N>> {
    return (iterable) => ({
        [$S]() {
            const d: Iterator<any>[] = new Array(depth + 1);
            d[0] = iterable[$S]();
            let level = 0;
            return {
                next() {
                    do {
                        const v = d[level].next(); // next value
                        if (v.done) {
                            if (!level) {
                                return v; // we are finished
                            }
                            level--; // back to upper level
                            continue;
                        }
                        if (level === depth) {
                            return v; // maximum depth reached
                        }
                        const i = (v.value as Iterable<T>)?.[$S]?.();
                        if (!i) {
                            return v; // non-iterable value
                        }
                        d[++level] = i; // save next iterable
                    } while (true);
                },
            };
        },
    });
}
