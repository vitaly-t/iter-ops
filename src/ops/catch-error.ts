import {Piper} from '../types';

export interface IErrorInfo<T> {
    index: number;
    lastValue?: T;

    emit(value: T): void;
}

/**
 * Catches iteration errors, to either re-throw or return a new value of the same type.
 *
 * Callback parameters:
 *
 *  - error: the error that was thrown
 *  - index: index of the value that we failed to retrieve
 *  - lastValue: last successful value, if any, or else undefined
 */
export function catchError<T>(cb: (error: any, info: IErrorInfo<T>) => never): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, last: IteratorResult<T>;
            return {
                next(): IteratorResult<T> {
                    do {
                        try {
                            last = i.next();
                        } catch (e) {
                            let value: T, emitted = false;
                            const info: IErrorInfo<T> = {
                                index: index++,
                                lastValue: last?.value,
                                emit(v) {
                                    value = v;
                                    emitted = true;
                                }
                            };
                            cb(e, info);
                            if (emitted) {
                                return {value};
                            }
                            // TODO: what do we do here?
                        }
                        index++;
                        if (!last?.done) {
                            return last;
                        }
                    } while (!last.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
