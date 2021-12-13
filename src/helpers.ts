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

export function toIterable<T>(i: T): Iterable<T>;
export function toIterable<T>(i: Iterator<T>): Iterable<T>;
export function toIterable<T>(i: AsyncIterator<T>): AsyncIterable<T>;

export function toIterable<T>(i: any): any {
    let value = i?.next;
    if (typeof value === 'function') {
        value = value.call(i);
        let s: any = typeof value?.then === 'function' && Symbol.asyncIterator;
        if (s || (typeof value === 'object' && 'value' in (value ?? {}))) {
            s = s ?? Symbol.iterator;
            return {
                [s]: () => ({
                    next() {
                        this.next = i.next.bind(i);
                        return value;
                    }
                })
            };
        }
    }
    return {
        [Symbol.iterator](): Iterator<T> {
            let finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (finished) {
                        return {value: undefined, done: true};
                    }
                    finished = true;
                    return {value, done: false};
                }
            };
        }
    };
}
