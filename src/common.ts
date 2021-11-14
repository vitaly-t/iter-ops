/**
 * Pipe-through type (return type for all operators)
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}

/**
 * Extended Iterable.
 */
export interface IterableExt<T> extends Iterable<T> {
    /**
     * - first element produced by the iterable;
     * - undefined, if the iterable produces nothing.
     */
    readonly first?: T;
}
