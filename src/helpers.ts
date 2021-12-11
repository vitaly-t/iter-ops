/**
 * Converts any synchronous iterable into asynchronous one.
 *
 * It makes possible use of asynchronous-only operators downstream,
 * while also correctly casting all types in the pipeline, avoiding
 * any ambiguity between synchronous and asynchronous iterables.
 *
 * @category Core
 */
export function toAsync<T>(i: Iterable<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const it = i[Symbol.iterator]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return Promise.resolve(it.next());
                }
            };
        }
    };
}
