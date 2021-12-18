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
            /*
            const list: Iterator<any>[] = [
                iterable[Symbol.iterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() : v)
            ];
            let finished: boolean;*/
            return {
                next(): IteratorResult<Array<any>> {
                    // TODO: logic here is clear - keep getting values from all sources,
                    //  and emit the combinations while at least source keeps going.
                    //  And we start after all emitted at least once.
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function combineAsync<T>(iterable: AsyncIterable<T>, ...values: AnyIterable<T>[]): AsyncIterable<Array<any>> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<Array<T>> {
            /*
            const list: AnyIterator<any>[] = [
                iterable[Symbol.asyncIterator](),
                ...values.map((v: any) => typeof v[Symbol.iterator] === 'function' ? v[Symbol.iterator]() :
                    (typeof v[Symbol.asyncIterator] === 'function' ? v[Symbol.asyncIterator]() : v))
            ];
            let finished: boolean;*/
            // TODO: Parking, because logic for asynchronous "combine" isn't clear.
            //  This needs some thinking.
            return {
                next(): Promise<IteratorResult<Array<any>>> {
                    return Promise.resolve({value: undefined, done: true});
                }
            };
        }
    };
}
