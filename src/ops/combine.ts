import {AnyIterable, AnyIterableIterator, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits combinations of the latest values from all sources.
 *
 * The first emit happens after all sources emit at least one value. After that,
 * any source emit will produce a new combination that will be emitted.
 *
 * ```ts
 * import {pipe, combine} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     combine('hello') // <- any number of arguments
 * );
 *
 * console.log(...i); //=> [1, 'h'], [2, 'e'], [3, 'l'], [3, 'l'], [3, 'o']
 * ```
 *
 * The operator takes any number of `Iterable` + `Iterator` arguments.
 *
 * @see [[zip]]
 * @category Sync+Async
 */
export function combine<T>(): Operation<T, [T]>;

/** @hidden */
export function combine<T, A>(v0: AnyIterableIterator<A>): Operation<T, [T, A]>;
/** @hidden */
export function combine<T, A, B>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>): Operation<T, [T, A, B]>;
/** @hidden */
export function combine<T, A, B, C>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>): Operation<T, [T, A, B, C]>;
/** @hidden */
export function combine<T, A, B, C, D>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>): Operation<T, [T, A, B, C, D]>;
/** @hidden */
export function combine<T, A, B, C, D, E>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>): Operation<T, [T, A, B, C, D, E]>;
/** @hidden */
export function combine<T, A, B, C, D, E, F>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>): Operation<T, [T, A, B, C, D, E, F]>;
/** @hidden */
export function combine<T, A, B, C, D, E, F, G>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>): Operation<T, [T, A, B, C, D, E, F, G]>;
/** @hidden */
export function combine<T, A, B, C, D, E, F, G, H>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>): Operation<T, [T, A, B, C, D, E, F, G, H]>;
/** @hidden */
export function combine<T, A, B, C, D, E, F, G, H, I>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>, v8: AnyIterableIterator<I>): Operation<T, [T, A, B, C, D, E, F, G, H, I]>;
/** @hidden */
export function combine<T, A, B, C, D, E, F, G, H, I, J>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>, v8: AnyIterableIterator<I>, v9: AnyIterableIterator<J>): Operation<T, [T, A, B, C, D, E, F, G, H, I, J]>;

export function combine<T>(...values: AnyIterableIterator<T>[]): Operation<T, Array<any>> {
    return createOperation(combineSync, combineAsync, arguments);
}

function combineSync<T>(iterable: Iterable<T>, ...values: (Iterator<T> | Iterable<T>)[]): Iterable<Array<any>> {
    return {
        [Symbol.iterator](): Iterator<Array<any>> {
            const list: Array<any> = [
                iterable[Symbol.iterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() : v)
            ];
            let started: boolean, finished: boolean, latest: Array<any>;
            return {
                next(): IteratorResult<Array<any>> {
                    if (!started) {
                        started = true;
                        const value = [];
                        for (let i = 0; i < list.length; i++) {
                            const a = list[i].next();
                            if (a.done) {
                                finished = true;
                                return a;
                            }
                            value.push(a.value);
                        }
                        latest = [...value];
                        return {value, done: false};
                    }
                    if (!finished) {
                        let hasValues = false;
                        for (let k = 0; k < list.length; k++) {
                            const m = list[k];
                            if (m) {
                                const a = m.next();
                                if (a.done) {
                                    list[k] = null; // stop requesting values
                                } else {
                                    hasValues = true;
                                    latest[k] = a.value;
                                }
                            }
                        }
                        if (hasValues) {
                            return {value: [...latest], done: false};
                        }
                        finished = true;
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function combineAsync<T>(iterable: AsyncIterable<T>, ...values: AnyIterable<T>[]): AsyncIterable<any[]> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T[]> {
            const list: any[] = [
                iterable[Symbol.asyncIterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() :
                    (typeof v[Symbol.asyncIterator] === 'function' ? v[Symbol.asyncIterator]() : v))
            ];
            const pending = new Promise(() => {
                // forever-pending promise
            });
            let start: Promise<IteratorResult<any[]>>, finished: boolean, latest: any[] = new Array(list.length),
                changed = false, error: any, finishedCount = 0;
            return {
                next(): Promise<IteratorResult<any>> {
                    if (!start) {
                        start = Promise.all(list.map(a => a.next())).then(all => {
                            const value = [];
                            for (let i = 0; i < all.length; i++) {
                                const m = all[i];
                                if (m.done) {
                                    finished = true;
                                    return m;
                                }
                                value.push(m.value);
                            }
                            latest = [...value];
                            return {value, done: false};
                        });
                        return start;
                    }
                    if (!finished) {
                        const getValues = () => list.map((a: any, index: number) => {
                            if (!a) {
                                return pending;
                            }
                            const p = a.next();
                            const it = typeof p?.then === 'function' ? p : Promise.resolve(p);
                            return it.then((v: any) => {
                                if (v.done) {
                                    list[index] = null; // stop requesting values;
                                    if (++finishedCount === list.length) {
                                        return Promise.resolve(true); // the end;
                                    }
                                    return pending;
                                }
                                latest[index] = v.value;
                                changed = true;
                            }).catch((e: any) => {
                                error = error || e;
                            });
                        });
                        return start
                            .then(() => {
                                if (error) {
                                    error = null;
                                    return Promise.reject(error);
                                }
                                if (changed) {
                                    changed = false;
                                    return {value: [...latest], done: false};
                                }
                                return Promise.race(getValues()).then(end => {
                                    if (end) {
                                        finished = true;
                                        return {value: undefined, done: true};
                                    }
                                    changed = false;
                                    return {value: [...latest], done: false};
                                }).catch(err => {
                                    finished = true;
                                    throw err;
                                });
                            });
                    }
                    return Promise.resolve({value: undefined, done: true});
                }
            };
        }
    };
}
