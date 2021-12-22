import {Operation} from '../../types';
import {createOperation} from '../../shared';
import {isPromise, throwOnSync} from '../../utils';

/**
 * When the value is a `Promise`, it is resolved, or else returned as is,
 * i.e. the same logic as for JavaScript operator `await`.
 * It throws an error during iteration, if inside a synchronous pipeline.
 *
 * ```ts
 * import {pipe, toAsync, map, wait} from 'iter-ops';
 *
 * const userIds = [1, 2, 3, 4, 5]; // synchronous list of user id-s
 *
 * const i = pipe(
 *     toAsync(userIds), // make pipeline asynchronous
 *     map(id => myService.getUserData(id)), // map into promises
 *     wait() // resolve each promise
 * );
 *
 * for await(const user of i) {
 *     console.log(user); // print details for each user
 * }
 * ```
 *
 * In case you want all promises resolved before emitting values:
 *
 * ```ts
 * import {pipe, toAsync, map, aggregate, wait, spread} from 'iter-ops';
 *
 * const userIds = [1, 2, 3, 4, 5]; // synchronous list of user id-s
 *
 * const i = pipe(
 *     toAsync(userIds), // make pipeline asynchronous
 *     map(id => myService.getUserData(id)), // map into promises
 *     aggregate(list => Promise.all(list)), // resolve all promises
 *     wait(), // resolve the list
 *     spread() // emit each resolved value
 * );
 *
 * for await(const user of i) {
 *     console.log(user); // print details for each user
 * }
 * ```
 *
 * @category Async-only
 */
export function wait<T>(): Operation<Promise<T> | T, T>;

export function wait<T>() {
    return createOperation(throwOnSync('wait'), waitAsync, arguments);
}

export function waitAsync<T>(iterable: AsyncIterable<Promise<T> | T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a as any;
                        }
                        const p = a.value as Promise<T>;
                        return isPromise(p) ? p?.then(value => ({value, done: false})) : a;
                    });
                }
            };
        }
    };
}
