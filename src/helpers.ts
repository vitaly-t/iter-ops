/**
 * Converts any synchronous iterable into asynchronous one.
 *
 * It makes possible use of asynchronous-only operators downstream,
 * while also correctly casting all types in the pipeline, avoiding
 * any ambiguity between synchronous and asynchronous iterables.
 *
 * ```ts
 * const i = pipe(
 *     toAsync(source), // make iterable asynchronous
 *     delay(500) // now can use asynchronous operators
 * );
 * ```
 *
 * @category Core
 */
export function toAsync<T>(i: Iterable<T>): AsyncIterable<T>;

export function toAsync<T>(i: Iterator<T>): AsyncIterable<T>;

export function toAsync<T>(i: Iterable<T> | Iterator<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const f = (i as Iterable<T>)[Symbol.iterator];
            let it: Iterator<T>;
            if (typeof f === 'function') {
                it = f.call(i);
            } else {
                it = i as Iterator<T>;
                if (typeof it?.next !== 'function') {
                    throw new TypeError(`Value not iterable: ${JSON.stringify(i)}`);
                }
            }
            return {
                next(): Promise<IteratorResult<T>> {
                    return Promise.resolve(it.next());
                }
            };
        }
    };
}
