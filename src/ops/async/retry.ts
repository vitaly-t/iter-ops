import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * When the iterable rejects, retries getting the value specified number of times.
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator `repeat`.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 */
export function retry<T>(attempts: number): Operation<T, T>;

/**
 * When the iterable rejects, the callback is to return the flag, indicating whether
 * we should retry getting the value one more time.
 *
 * The callback is only invoked when there is a failure, and it receives:
 * - `index` - index of the iterable value that we failed to acquire
 * - `attempts` - number of retry attempts we've made so far (starts with 0)
 * - `state` - state for the entire iteration session
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator `repeat`.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 */
export function retry<T>(cb: (index: number, attempts: number, state: IterationState) => boolean | Promise<boolean>): Operation<T, T>;

export function retry<T>(retry: number | ((index: number, attempts: number, state: IterationState) => boolean | Promise<boolean>)): Operation<T, T> {
    return createOperation(throwOnSync('retry'), retryAsync, arguments);
}

function retryAsync<T>(iterable: AsyncIterable<T>, retry: number | ((index: number, attempts: number, state: IterationState) => boolean | Promise<boolean>)): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            const cb = typeof retry === 'function' && retry;
            let attempts = 0;
            const getLeftTries = () => !cb && retry > 0 ? retry as number : 0;
            let leftTries = getLeftTries();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next()
                        .then(a => {
                            index++;
                            attempts = 0;
                            leftTries = getLeftTries();
                            return a;
                        })
                        .catch(e => {
                            if (cb) {
                                const b = (f: any) => f ? this.next() : Promise.reject(e);
                                const r = cb(index, attempts++, state) as Promise<boolean>;
                                return typeof r?.then === 'function' ? r.then(b) : b(r);
                            }
                            if (leftTries) {
                                leftTries--;
                                return this.next();
                            }
                            return Promise.reject(e);
                        });
                }
            };
        }
    };
}
