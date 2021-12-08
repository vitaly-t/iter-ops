import {IterationState, Operation} from '../../types';
import {createOperation} from '../../utils';

export function delay<T>(timeout: number): Operation<T, T>;
export function delay<T>(cb: (value: T, index: number, state: IterationState) => number): Operation<T, T>;

/**
 * Bla-bla
 */
export function delay<T>(timeout: number | ((value: T, index: number, state: IterationState) => number)): Operation<T, T> {
    return createOperation(delaySync, delayAsync, arguments);
}

function delayAsync<T>(iterable: AsyncIterable<T>, timeout: number | ((value: T, index: number, state: IterationState) => number)): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            //const i = iterable[Symbol.asyncIterator]();
            //const state: IterationState = {};
            //let index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function delaySync<T>(): Iterable<T> {
    throw new Error('Operator "delay" can only be used in asynchronous pipeline');
}
