import {IErrorContext, Piper} from '../types';

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
export function catchError<T>(cb: (error: any, ctx: IErrorContext<T>) => void): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
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
                    } while (!last.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
