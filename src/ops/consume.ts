import type {Operation, UnknownIterable} from '../types';
import {createOperation} from '../utils';
import {$A, $S} from '../types';
import {isPromiseLike} from '../typeguards';

/**
 * Exposes the source iterable to an external consumer, and emits a one-value iterable with that consumer.
 *
 * It is to simplify integration with external API that consumes iterables.
 *
 * ```ts
 * import {pipeAsync, consume} from 'iter-ops';
 * import {Readable} from 'stream';
 *
 * const i = pipeAsync(
 *     [1, 2, 3, 4, 5],
 *     consume(source => Readable.from(source))
 * ); //=> AsyncIterableExt<Readable>
 *
 * const r = await i.first; //=> Readable stream
 * ```
 *
 * The consumer callback can optionally return a `Promise` when inside asynchronous pipeline.
 *
 * Flag `sync` in the callback is `true` when the iterable is synchronous, and `false` when asynchronous.
 *
 * @category Sync+Async
 */
export function consume<T, R>(
    consumer: (data: UnknownIterable<T>, sync: boolean) => R | Promise<R>,
): Operation<T, R>;

export function consume(...args: unknown[]) {
    return createOperation(consumeSync, consumeAsync, args);
}

function consumeSync<T, R>(
    iterable: Iterable<T>,
    consumer: (data: Iterable<T>, sync: boolean) => R,
): Iterable<R> {
    return {
        [$S](): Iterator<R> {
            let done = false;
            return {
                next(): IteratorResult<R> {
                    if (!done) {
                        done = true;
                        return {value: consumer(iterable, true), done: false};
                    }
                    return {value: undefined, done};
                },
            };
        },
    };
}

function consumeAsync<T, R>(
    iterable: AsyncIterable<T>,
    consumer: (data: AsyncIterable<T>, sync: boolean) => R | Promise<R>,
): AsyncIterable<R> {
    return {
        [$A](): AsyncIterator<R> {
            let done = false;
            return {
                next(): Promise<IteratorResult<R>> {
                    if (!done) {
                        done = true;
                        const a = consumer(iterable, false) as any;
                        if (isPromiseLike(a)) {
                            return a.then((value: R) => ({value, done: false}));
                        }
                        return Promise.resolve({value: a, done: false});
                    }
                    return Promise.resolve({value: undefined, done});
                },
            };
        },
    };
}
