/**
 * Converts any synchronous iterable into asynchronous one.
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
