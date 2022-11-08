import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Caches up every N promises, to race-resolve them and emit unordered results.
 *
 * It improves performance when handling multiple lengthy asynchronous operations,
 * by letting you process results in the order in which they resolve, rather than
 * the order in which those operations are created.
 *
 * ```ts
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3, 4, 5],
 *              map(a => Promise.resolve(a * 10)), // replace with async processing
 *              waitRace(3) // cache & wait for up to 3 values at a time
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> 10, 40, 20, 50, 30 (unordered race-resolution)
 * }
 * ```
 *
 * This operator can handle a combination of promises and simple values, with the latter
 * emitted immediately, as they appear.
 *
 * When results need to be linked to the source, you can simply remap the operations,
 * like shown in the following example:
 *
 * ```ts
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3],
 *              map(s => Promise.resolve(s * 10).then(r => ({s, r}))), // {source, resolution}
 *              waitRace(2)
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> {s: 1, r: 10}, {s: 3, r: 30}, {s: 2, r: 20} (unordered race-resolution)
 * }
 * ```
 *
 * @param cacheSize
 * Maximum number of promises to be cached up for concurrent resolution racing.
 *
 * @see
 *  - {@link wait}
 *
 * @category Async-only
 */
export function waitRace<T>(cacheSize: number): Operation<Promise<T> | T, T>;

export function waitRace(...args: unknown[]) {
    return createOperation(throwOnSync('waitRace'), waitRaceAsync, args);
}

export function waitRaceAsync<T>(
    iterable: AsyncIterable<Promise<T> | T>,
    cacheSize: number
): AsyncIterable<T> {
    cacheSize = cacheSize > 1 ? cacheSize : 1; // cache size cannot be smaller than 1
    return {
        [$A](): AsyncIterator<T> {
            const source = iterable[$A]();
            let finished = false;
            // resolvers for currently active tasks, that are racing to remove and call the first one:
            const resolvers: ((
                res: IteratorResult<T> | Promise<never>
            ) => void)[] = [];
            // cache of promises to be resolved or to be returned by `.next()` to the destination:
            const promises: Promise<IteratorResult<T>>[] = [];
            function kickOffNext(): void {
                promises.push(
                    new Promise((resolve) => {
                        resolvers.push(resolve);
                        // `new Promise` executor handles synchronous exceptions
                        source.next().then(
                            (a) => {
                                if (a.done) {
                                    finished = true;
                                    resolvers.pop()!(a);
                                } else if (isPromiseLike(a.value)) {
                                    const promise = Promise.resolve(a.value);
                                    promise.then(
                                        (value: any) => {
                                            resolvers.shift()!({
                                                done: false,
                                                value,
                                            });
                                            kickOffMore();
                                        },
                                        () => {
                                            resolvers.shift()!(
                                                promise as Promise<never>
                                            );
                                            kickOffMore();
                                        }
                                    );
                                } else {
                                    resolvers.shift()!(a as IteratorResult<T>);
                                }
                                kickOffMore(); // advance source iterator as far as possible within limit
                            },
                            (err) => {
                                // handle rejections from calling `i.next()`
                                resolvers.shift()!(Promise.reject(err));
                                finished = true;
                            }
                        );
                    })
                );
            }
            function kickOffMore() {
                if (
                    !finished && // stop when source is done
                    promises.length < cacheSize && // backpressure: don't put too many promises in the cache if destination doesn't poll `.next()` fast enough
                    resolvers.length < cacheSize // limit: don't let more tasks than the maximum race to resolve the next promises
                ) {
                    kickOffNext();
                }
            }
            return {
                next(): Promise<IteratorResult<T>> {
                    if (!promises.length) {
                        kickOffNext();
                    }
                    return promises.shift()!;
                },
            };
        },
    };
}
