import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * When the iterable rejects, retries getting the value specified number of times.
 */
export function retry<T>(attempts: number): Operation<T, T>;

/**
 * When the iterable rejects, the callback is to return an asynchronous flag,
 * indicating whether we should retry getting the value one more time.
 *
 * The callback is only called when there is a failure, and it receives:
 * - `index` - index of the iterable value that we failed to acquire
 * - `attempts` - number of retry attempts we've made so far (starts with 0)
 * - `state` - state for the entire iteration session
 */
export function retry<T>(cb: (index: number, attempts: number, state: IterationState) => Promise<boolean>): Operation<T, T>;

export function retry<T>(retry: number | ((index: number, attempts: number, state: IterationState) => Promise<boolean>)): Operation<T, T> {
    return createOperation(throwOnSync('retry'), retryAsync, arguments);
}

function retryAsync<T>(iterable: AsyncIterable<T>, retry: number | ((index: number, attempts: number, state: IterationState) => Promise<boolean>)): AsyncIterable<T> {
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
                                return cb(index, attempts++, state).then(r => r ? this.next() : Promise.reject(e));
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
