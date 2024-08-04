import {$A, $S, type IterationState, type Operation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

/**
 * Skips values until the predicate test succeeds.
 * The value for which predicate succeeds is not skipped.
 *
 * ```ts
 * import {pipe, skipUntil} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipUntil(a => a > 5) // skip until value > 5
 * );
 *
 * console.log(...i); //=> 6, 7, 8, 9
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function skipUntil<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): Operation<T, T>;

export function skipUntil(...args: unknown[]) {
    return createOperation(skipUntilSync, skipUntilAsync, args);
}

function skipUntilSync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => boolean
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!started) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        started = !a.done;
                    }
                    return a;
                }
            };
        }
    };
}

function skipUntilAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (started || a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) => {
                            started = flag;
                            return started ? a : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                }
            };
        }
    };
}
