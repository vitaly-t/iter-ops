import {AnyIterable, AnyIterator, AnyIterableIterator, Operation} from '../types';
import {createOperation} from '../shared';

/** @hidden */
export function zip<T>(): Operation<T, [T]>;

/**
 * Zips values together by index, into an array, while all sources continue emitting.
 *
 * ```ts
 * import {pipe, zip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     zip('hello') // <- any number of arguments
 * );
 *
 * console.log(...i); //=> [1, 'h'], [2, 'e'], [3, 'l']
 * ```
 *
 * The operator takes any number of iterable or iterator arguments.
 *
 * @category Sync+Async
 */
export function zip<T, A>(v0: AnyIterableIterator<A>): Operation<T, [T, A]>;
/** @hidden */
export function zip<T, A, B>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>): Operation<T, [T, A, B]>;
/** @hidden */
export function zip<T, A, B, C>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>): Operation<T, [T, A, B, C]>;
/** @hidden */
export function zip<T, A, B, C, D>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>): Operation<T, [T, A, B, C, D]>;
/** @hidden */
export function zip<T, A, B, C, D, E>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>): Operation<T, [T, A, B, C, D, E]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>): Operation<T, [T, A, B, C, D, E, F]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>): Operation<T, [T, A, B, C, D, E, F, G]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>): Operation<T, [T, A, B, C, D, E, F, G, H]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>, v8: AnyIterableIterator<I>): Operation<T, [T, A, B, C, D, E, F, G, H, I]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I, J>(v0: AnyIterableIterator<A>, v1: AnyIterableIterator<B>, v2: AnyIterableIterator<C>, v3: AnyIterableIterator<D>, v4: AnyIterableIterator<E>, v5: AnyIterableIterator<F>, v6: AnyIterableIterator<G>, v7: AnyIterableIterator<H>, v8: AnyIterableIterator<I>, v9: AnyIterableIterator<J>): Operation<T, [T, A, B, C, D, E, F, G, H, I, J]>;

export function zip<T>(...values: AnyIterableIterator<T>[]): Operation<T, Array<any>> {
    return createOperation(zipSync, zipAsync, arguments);
}

function zipSync<T>(iterable: Iterable<T>, ...values: (Iterator<T> | Iterable<T>)[]): Iterable<Array<any>> {
    return {
        [Symbol.iterator](): Iterator<Array<any>> {
            const list: Iterator<any>[] = [
                iterable[Symbol.iterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() : v)
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
                                return v;
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

function zipAsync<T>(iterable: AsyncIterable<T>, ...values: AnyIterable<T>[]): AsyncIterable<Array<any>> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<Array<T>> {
            const list: AnyIterator<any>[] = [
                iterable[Symbol.asyncIterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() :
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
                                    return a[i];
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
