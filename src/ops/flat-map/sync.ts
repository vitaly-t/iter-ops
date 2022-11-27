import {$S, IterationState, SyncOperation} from '../../types';

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
): SyncOperation<T, R extends Iterable<infer E> ? E : R> {
    return (iterable) => ({
        [$S]() {
            const i = iterable[$S]();
            const state: IterationState = {};
            let spread: any; // spread sub-iterator
            let index = 0;
            return {
                next() {
                    do {
                        if (spread) {
                            const a = spread.next();
                            if (a.done) {
                                spread = null;
                                continue;
                            }
                            return a;
                        }
                        const v = i.next();
                        if (v.done) {
                            return v;
                        }
                        const value: any = cb(v.value, index++, state);
                        spread = value?.[$S]?.();
                        if (!spread) {
                            return {value, done: false};
                        }
                    } while (true);
                },
            };
        },
    });
}
