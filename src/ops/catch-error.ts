import {IErrorContext, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Catches iteration errors.
 *
 * What you can do inside the error handler:
 *
 * - nothing (we let it skip the value);
 * - provide a new/alternative value (via ctx.emit(value));
 * - re-throw the original error;
 * - throw a new error.
 */
export function catchError<T>(cb: (error: any, ctx: IErrorContext<T>) => void): Operation<T, T> {
    return createOperation(catchErrorSync, catchErrorAsync, arguments);
}

function catchErrorSync<T>(iterable: Iterable<T>, cb: (error: any, ctx: IErrorContext<T>) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, last: IteratorResult<T>;
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
                            let value: T, emitted;
                            cb(e, {
                                index: index++,
                                lastValue: last?.value,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            });
                            if (emitted) {
                                return {value: value!};
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
            let index = 0, last: IteratorResult<T>;
            return {
                async next(): Promise<IteratorResult<T>> {
                    do {
                        try {
                            last = await i.next();
                            index++;
                            if (!last.done) {
                                return last;
                            }
                        } catch (e) {
                            let value: T, emitted;
                            cb(e, {
                                index: index++,
                                lastValue: last?.value,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            });
                            if (emitted) {
                                return {value: value!};
                            }
                        }
                    } while (!last?.done);
                    return {value: undefined, done: true};
                }
            };
        }
    };
}
