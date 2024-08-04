import {
    $A,
    $S,
    type IErrorContext,
    type IterationState,
    type Operation
} from '../types';
import {createOperation} from '../utils';

/**
 * Catches all iteration errors up the chain (see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}).
 *
 * Below is explicit error handling, by injecting `catchError` into the pipeline:
 *
 * ```ts
 * import {pipe, catchError, map} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     map(a => {
 *         if (a % 2 === 0) {
 *             throw new Error('even number');
 *         }
 *         return a;
 *     }),
 *     catchError((err, ctx) => {
 *         console.log(err);
 *     })
 * );
 * ```
 *
 * What you can do inside the error handler:
 *
 * - nothing (we let it skip the value)
 * - provide a new/alternative value (via `ctx.emit(value)`)
 * - re-throw the original error
 * - throw a new error
 *
 * Below is implicit error handling, via `catch`, which just appends `catchError` to the pipeline:
 *
 * ```ts
 * import {pipe, map} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     map(a => {
 *         if (a % 2 === 0) {
 *             throw new Error('even number');
 *         }
 *         return a;
 *     })
 * )
 *     .catch((err, ctx) => {
 *         console.log(err);
 *     });
 * ```
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
 *  - {@link catchError}
 * @category Diagnostics
 */
export function catchError<T>(
    cb: (error: any, ctx: IErrorContext<T>) => void
): Operation<T, T>;

export function catchError(...args: unknown[]) {
    return createOperation(catchErrorSync, catchErrorAsync, args);
}

function catchErrorSync<T>(
    iterable: Iterable<T>,
    cb: (error: any, ctx: IErrorContext<T>) => void
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                repeats: number,
                last: IteratorResult<T>,
                lastError: any;
            return {
                next(): IteratorResult<T> {
                    do {
                        try {
                            last = i.next();
                            index++;
                            if (!last.done) {
                                return last;
                            }
                        } catch (e) {
                            repeats = sameError(e, lastError) ? repeats + 1 : 0;
                            lastError = e;
                            let value: any, emitted;
                            cb(e, {
                                index: index++,
                                lastValue: last?.value,
                                repeats,
                                state,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            });
                            if (emitted) {
                                return {value, done: false};
                            }
                        }
                    } while (!last?.done);
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function catchErrorAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (error: any, ctx: IErrorContext<T>) => void
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0,
                repeats: number,
                last: IteratorResult<T>,
                lastError: any;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(
                        (a) => {
                            last = a;
                            index++;
                            return a;
                        },
                        (e) => {
                            repeats = sameError(e, lastError) ? repeats + 1 : 0;
                            lastError = e;
                            let value: any, emitted;
                            cb(e, {
                                index: index++,
                                lastValue: last?.value,
                                repeats,
                                state,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            });
                            return emitted ? {value, done: false} : this.next();
                        }
                    );
                }
            };
        }
    };
}

/**
 * Helper for determining when we are looking at the same error.
 */
function sameError(a: any, b: any): boolean {
    return a === b || (a?.message && a.message === b?.message);
}
