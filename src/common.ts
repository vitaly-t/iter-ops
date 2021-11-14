/**
 * Extended Iterable.
 */
export interface IterableExt<T> extends Iterable<T> {
    /**
     * - first element produced by the iterable;
     * - undefined, if the iterable produced nothing.
     */
    readonly first?: T;
}

/**
 * Pipe-through type (return type for all operators)
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}
