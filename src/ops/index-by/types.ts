/**
 * Pair of `{index, value}` that passed predicate test of {@link indexBy} operator.
 *
 * @see {@link indexBy}
 */
export interface IIndexedValue<T> {
    /**
     * Index of the value that passed the predicate test.
     */
    index: number;

    /**
     * Value that corresponds to the `index`.
     */
    value: T;
}
