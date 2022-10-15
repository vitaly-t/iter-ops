import {$A, $S, IterationState, Operation, UnknownIterable} from '../types';
import {createOperation} from '../utils';
import {isPromiseLike} from '../typeguards';

/**
 * **New in v2.0.0**
 *
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
 * @category Sync+Async
 */
export function flatMap<T, R>(
    cb: (value: T, index: number, state: IterationState) => R
): Operation<T, R extends UnknownIterable<infer E> ? E : R>;

export function flatMap(...args: unknown[]) {
    return createOperation(flatMapSync as any, flatMapAsync as any, args);
}

function flatMapSync<T, R>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): Iterable<R> {
    return {
        [$S](): Iterator<R> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let spread: any; // spread sub-iterator
            let index = 0;
            return {
                next(): IteratorResult<R> {
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
    };
}

function flatMapAsync<T, R>(
    iterable: AsyncIterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): AsyncIterable<R> {
    return {
        [$A](): AsyncIterator<R> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let spread: any; // sync or async sub-iterator to be spread
            let sync: boolean; // set when 'spread' is synchronous
            let index = 0;
            return {
                next(): Promise<IteratorResult<R>> {
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
    };
}
