import {IErrorContext, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Catches iteration errors.
 *
 * What you can do inside the error handler:
 *
 * - nothing (we let it skip the value);
 * - provide a new/alternative value (via `ctx.emit(value)`);
 * - re-throw the original error;
 * - throw a new error.
 *
 * @see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
 * @category Sync+Async
 */
export function catchError<T>(cb: (error: any, ctx: IErrorContext<T>) => void): Operation<T, T> {
    return createOperation(catchErrorSync, catchErrorAsync, arguments);
}

function catchErrorSync<T>(iterable: Iterable<T>, cb: (error: any, ctx: IErrorContext<T>) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, repeats: number, last: IteratorResult<T>, lastError: any;
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
                            let value: T, emitted;
                            cb(e, {
                                index: index++,
                                lastValue: last?.value,
                                repeats,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            });
                            if (emitted) {
                                return {value: value!, done: false};
                            }
                        }
                    } while (!last?.done);
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function catchErrorAsync<T>(iterable: AsyncIterable<T>, cb: (error: any, ctx: IErrorContext<T>) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let index = 0, repeats: number, last: IteratorResult<T>, lastError: any;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        last = a;
                        index++;
                        return a;
                    }).catch(e => {
                        repeats = sameError(e, lastError) ? repeats + 1 : 0;
                        lastError = e;
                        let value: T, emitted;
                        cb(e, {
                            index: index++,
                            lastValue: last?.value,
                            repeats,
                            emit(v) {
                                value = v;
                                emitted = true;
                            }
                        });
                        return emitted ? {value: value!, done: false} : this.next();
                    });
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
