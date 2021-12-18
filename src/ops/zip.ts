import {AnyIterable, Operation} from '../types';
import {createOperation} from '../utils';

type IT<T> = Iterator<T> | AsyncIterator<T> | Iterable<T> | AsyncIterable<T>;

export function zip<T>(): Operation<T, [T]>;
export function zip<T, A>(v0: IT<A>): Operation<T, [T, A]>;
export function zip<T, A, B>(v0: IT<A>, v1: IT<B>): Operation<T, [T, A, B]>;
export function zip<T, A, B, C>(v0: IT<A>, v1: IT<B>, v2: IT<C>): Operation<T, [T, A, B, C]>;
export function zip<T, A, B, C, D>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>): Operation<T, [T, A, B, C, D]>;
export function zip<T, A, B, C, D, E>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>): Operation<T, [T, A, B, C, D, E]>;
export function zip<T, A, B, C, D, E, F>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>, v5: IT<F>): Operation<T, [T, A, B, C, D, E, F]>;
export function zip<T, A, B, C, D, E, F, G>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>, v5: IT<F>, v6: IT<G>): Operation<T, [T, A, B, C, D, E, F, G]>;
export function zip<T, A, B, C, D, E, F, G, H>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>, v5: IT<F>, v6: IT<G>, v7: IT<H>): Operation<T, [T, A, B, C, D, E, F, G, H]>;
export function zip<T, A, B, C, D, E, F, G, H, I>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>, v5: IT<F>, v6: IT<G>, v7: IT<H>, v8: IT<I>): Operation<T, [T, A, B, C, D, E, F, G, H, I]>;
export function zip<T, A, B, C, D, E, F, G, H, I, J>(v0: IT<A>, v1: IT<B>, v2: IT<C>, v3: IT<D>, v4: IT<E>, v5: IT<F>, v6: IT<G>, v7: IT<H>, v8: IT<I>, v9: IT<J>): Operation<T, [T, A, B, C, D, E, F, G, H, I, J]>;

/**
 * Zips values together by index, into an array, while all iterables continue emitting.
 *
 * @category Sync+Async
 */
export function zip<T>(...values: IT<T>[]): Operation<T, Array<any>> {
    return createOperation(zipSync, zipAsync, arguments);
}

function zipSync<T>(iterable: Iterable<T>, values: (Iterator<T> | Iterable<T>)[]): Iterable<Array<any>> {
    return {
        [Symbol.iterator](): Iterator<Array<any>> {
            const list: Iterator<any>[] = [
                iterable[Symbol.iterator](),
                ...values.map(v => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() : v)
            ];
            let finished: boolean;
            return {
                next(): IteratorResult<Array<any>> {
                    if (!finished) {
                        const value = [];
                        for (let i = 0; i < list.length; i++) {
                            const v = list[i].next();
                            if (v.done) {
                                finished = true;
                                return {value: undefined, done: true};
                            }
                            value.push(v.value);
                        }
                        return {value, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function zipAsync<T>(iterable: AsyncIterable<T>, values: AnyIterable<T>[]): AsyncIterable<Array<any>> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<Array<T>> {
            const list: (Iterator<any> | AsyncIterator<any>)[] = [
                iterable[Symbol.asyncIterator](),
                ...values.map(v => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() :
                    (typeof v[Symbol.asyncIterator] === 'function' ? v[Symbol.asyncIterator]() : v))
            ];
            let finished: boolean;
            return {
                next(): Promise<IteratorResult<Array<any>>> {
                    if (!finished) {
                        return Promise.all(list.map(i => i.next())).then(a => {
                            const value = [];
                            for (let i = 0; i < a.length; i++) {
                                if (a[i].done) {
                                    finished = true;
                                    return {value: undefined, done: true};
                                }
                                value.push(a[i].value);
                            }
                            return {value, done: false};
                        });
                    }
                    return Promise.resolve({value: undefined, done: true});
                }
            };
        }
    };
}
