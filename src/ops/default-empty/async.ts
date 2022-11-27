import {Value, $S, $A, AsyncOperation} from '../../types';
import {isPromiseLike} from '../../typeguards';

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

export function defaultEmpty<T, D>(value: Value<D>): AsyncOperation<T, T | D> {
    return (iterable) => ({
        [$A](): AsyncIterator<T | D> {
            const i = iterable[$A]();
            let k: AsyncIterator<T>,
                started = false, // set once default iteration started
                done = false, // set when we are finished (with a simple value)
                skip = false; // set when default data not needed
            return {
                next(): Promise<IteratorResult<T | D>> {
                    if (skip) {
                        return i.next();
                    }
                    if (done) {
                        return Promise.resolve({value: undefined, done});
                    }
                    if (started) {
                        if (k) {
                            const b = k.next();
                            return isPromiseLike(b) ? b : Promise.resolve(b);
                        }
                        done = true; // we are done with our simple value;
                        return Promise.resolve({
                            value: value as any,
                            done: false,
                        });
                    }
                    return i.next().then((a) => {
                        if (a.done) {
                            const x = value as any;
                            k =
                                typeof x?.next === 'function'
                                    ? x
                                    : x?.[$S]?.() ?? x?.[$A]?.();
                            started = true;
                            return this.next();
                        }
                        skip = true;
                        return a;
                    });
                },
            };
        },
    });
}
