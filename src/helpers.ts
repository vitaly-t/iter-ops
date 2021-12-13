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

/**
 * Converts a synchronous iterator into a synchronous iterable, so it can be used as a pipeline input.
 *
 * Note that a correct iterator can only be determined by starting the iteration, which is what this method does.
 * So if getting the first iterator value throws an error, it will occur outside the pipeline.
 */
export function toIterable<T>(i: Iterator<T>): Iterable<T>;

/**
 * Converts an asynchronous iterator into asynchronous iterable, so it can be used as a pipeline input.
 *
 * Note that a correct iterator can only be determined by starting the iteration, which is what this method does.
 * So if getting the first iterator value throws an error, it will occur outside the pipeline.
 */
export function toIterable<T>(i: AsyncIterator<T>): AsyncIterable<T>;

/**
 * Converts a random value into a synchronous iterable, so it can be used as a pipeline input.
 */
export function toIterable<T>(i: T): Iterable<T>;

export function toIterable<T>(i: any): any {
    let value = i?.next;
    if (typeof value === 'function') {
        value = value.call(i); // this line may throw (outside the pipeline)
        let s: any = typeof value?.then === 'function' && Symbol.asyncIterator;
        if (s || (typeof value === 'object' && 'value' in (value ?? {}))) {
            s = s ?? Symbol.iterator;
            return {
                [s]: () => ({
                    next() {
                        this.next = i.next.bind(i); // redirecting into the original iterator
                        return value;
                    }
                })
            };
        }
    }
    return [value];
}
