import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.map} logic for the iterable,
 * extended for supporting iteration state.
 *
 * When the callback is asynchronous (returns a `Promise`), the operator does not resolve the value,
 * because this library gives you the flexibility of resolving those in a variety of ways:
 *  - you can follow it up with operator {@link wait} when you want a simple one-by-one resolution;
 *  - you can follow it up with operator {@link waitRace} when you want values emitted as they resolve;
 *  - you can follow it up with {@link aggregate} + `Promise.all`, if you want to group the resolution;
 *  - you can provide any custom resolution logic.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.map}
 * @category Sync+Async
 */
export function map<T, R>(
    cb: (value: T, index: number, state: IterationState) => R
): Operation<T, R>;

export function map(...args: unknown[]) {
    return createOperation(mapSync, mapAsync, args);
}

function mapSync<T, R>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): Iterable<R> {
    return {
        [$S](): Iterator<R> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    let a;
                    while (!(a = i.next()).done) {
                        return {
                            value: cb(a.value, index++, state),
                            done: false,
                        };
                    }
                    return a;
                },
            };
        },
    };
}

function mapAsync<T, R>(
    iterable: AsyncIterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): AsyncIterable<R> {
    return {
        [$A](): AsyncIterator<R> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<R>> {
                    return i.next().then((a) =>
                        a.done
                            ? a
                            : {
                                  value: cb(a.value, index++, state),
                                  done: false,
                              }
                    );
                },
            };
        },
    };
}
