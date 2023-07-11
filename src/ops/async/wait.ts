import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * When the value is a `Promise`, it is resolved, or else returned as is,
 * i.e. the same logic as for JavaScript operator `await`.
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
 * @throws `Error: 'Operator "wait" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link waitRace}
 *
 * @category Async-only
 */
export function wait<T>(): Operation<Promise<T> | T, T>;

export function wait() {
    return createOperation(throwOnSync('wait'), waitAsync);
}

export function waitAsync<T>(
    iterable: AsyncIterable<Promise<T> | T>,
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a as any;
                        }
                        const p = a.value as Promise<T>;
                        return isPromiseLike(p)
                            ? p.then((value) => ({value, done: false}))
                            : a;
                    });
                },
            };
        },
    };
}
