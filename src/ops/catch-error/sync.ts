import {$S, IErrorContext, IterationState, SyncOperation} from '../../types';
import {sameError} from '../../utils';

/**
 * Catches iteration errors (see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}).
 *
 * What you can do inside the error handler:
 *
 * - nothing (we let it skip the value)
 * - provide a new/alternative value (via `ctx.emit(value)`)
 * - re-throw the original error
 * - throw a new error
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
 *  - {@link catchError}
 *
 * @category Diagnostics
 */
export function catchError<T>(
    cb: (error: any, ctx: IErrorContext<T>) => void
): SyncOperation<T, T> {
    return (iterable) => ({
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
                                },
                            });
                            if (emitted) {
                                return {value, done: false};
                            }
                        }
                    } while (!last?.done);
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
