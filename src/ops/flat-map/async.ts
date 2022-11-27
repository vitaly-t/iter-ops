import {$A, $S, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

/**
 * Remaps and then flattens an iterable, consistent with the logic of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap Array.flatMap}
 *
 * ```ts
 * import {pipe, flatMap} from 'iter-ops';
 *
 * const i = pipe(
 *     ['hello', 'world!'],
 *     flatMap(a => a.length)
 * );
 *
 * console.log(...i); //=> 5 6
 * ```
 *
 * Note that when handling a synchronous iterable, this operator can remap+flatten only synchronous sub-iterables.
 * But when handling an asynchronous iterable, it can remap+flatten mixed sub-iterables, i.e. any combination of
 * synchronous and asynchronous sub-iterables.
 *
 * @see
 *  - {@link flat}
 *  - {@link map}
 * @category Operations
 */
export function flatMap<T, R>(
    cb: (value: T, index: number, state: IterationState) => R
): AsyncOperation<
    T,
    R extends Iterable<infer E> | AsyncIterable<infer E> ? E : R
> {
    return (iterable) => ({
        [$A]() {
            const i = iterable[$A]();
            const state: IterationState = {};
            let spread: any; // sync or async sub-iterator to be spread
            let sync: boolean; // set when 'spread' is synchronous
            let index = 0;
            return {
                next() {
                    if (spread) {
                        const a = spread.next();
                        if (sync) {
                            if (a.done) {
                                spread = null; // finished spreading
                                return this.next();
                            }
                            return Promise.resolve(a);
                        }
                        return a.then((b: IteratorResult<R>) => {
                            if (b.done) {
                                spread = null; // finished spreading
                                return this.next();
                            }
                            return b;
                        });
                    }
                    return i.next().then((c: IteratorResult<T>) => {
                        if (c.done) {
                            return c;
                        }
                        const out = (value: any) => {
                            spread = value?.[$S]?.();
                            sync = !!spread;
                            if (!spread) {
                                spread = value?.[$A]?.();
                                if (!spread) {
                                    return {value, done: false}; // return value as is
                                }
                            }
                            return this.next();
                        };
                        const v: any = cb(c.value, index++, state);
                        return isPromiseLike(v) ? v.then(out) : out(v);
                    });
                },
            };
        },
    });
}
