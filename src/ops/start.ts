import {$A, $S, IterationState, Operation} from '../types';
import {createOperation, isPromiseLike} from '../utils';

/**
 * Starts emitting values, once the predicate test passes.
 *
 * ```ts
 * import {pipe, start} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     start(a => a === 5) // start emitting when 5 is encountered
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see {@link stop}
 * @category Sync+Async
 */
export function start<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): Operation<T, T>;

export function start(...args: unknown[]) {
    return createOperation(startSync, startAsync, args);
}

function startSync<T>(
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
                        started = true;
                    }
                    return a;
                },
            };
        },
    };
}

function startAsync<T>(
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
                        if (started) {
                            return a;
                        }
                        const r = (a.done ||
                            cb(a.value, index++, state)) as Promise<boolean>;
                        const out = (flag: any) => {
                            started = flag;
                            return started ? a : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    };
}
