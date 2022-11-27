import {SyncValue, $S, SyncOperation} from '../../types';

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
 *
 * If the pipeline has at least one value, the defaults are ignored.
 *
 * ```ts
 * import {pipe, defaultEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [], // empty iterable/pipeline
 *     defaultEmpty([1, 2, 3]) // default for an empty pipeline
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Operations
 */
export function defaultEmpty<T, D>(
    value: SyncValue<D>
): SyncOperation<T, T | D> {
    return (iterable) => ({
        [$S](): Iterator<T | D> {
            const i = iterable[$S]();
            let k: Iterator<T>,
                v: any,
                start = true,
                empty = true,
                done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (!a.done) {
                            empty = false;
                            return a;
                        }
                        if (empty) {
                            if (start) {
                                v = value;
                                k =
                                    typeof v?.next === 'function'
                                        ? v
                                        : v?.[$S]?.();
                                start = false;
                            }
                            if (k) {
                                const b = k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
