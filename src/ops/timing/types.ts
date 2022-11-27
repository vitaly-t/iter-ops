import type {IterationState} from '../../types';

/**
 * Value timing details, produced by the {@link timing} operator.
 *
 * @see {@link timing}
 */
export interface IValueTiming<T> {
    /**
     * Time in ms it took to get the value.
     */
    duration: number;

    /**
     * Index of the value that was timed.
     */
    index: number;

    /**
     * Value that was timed.
     */
    value: T;

    /**
     * Iteration session state.
     */
    state: IterationState;

    /**
     * Iteration concurrency flag:
     *  - `true` - synchronous iteration
     *  - `false` - asynchronous iteration
     */
    sync: boolean;
}
