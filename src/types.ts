/**
 * Extended Iterable.
 */
export interface IterableExt<T> extends Iterable<T> {
    /**
     * - first element produced by the iterable;
     * - undefined, if the iterable produced nothing.
     *
     * It is to simplify use of one-value iterables.
     */
    readonly first?: T;

    /**
     * TODO: document
     */
    catch(cb: (error: any, index: number, lastValue?: T) => T): IterableExt<T>;
}

/**
 * Pipe-through type (return type for all operators)
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}

/**
 * Any templated value type: Value | Iterator | Iterable
 */
export type Any<T> = T | Iterator<T> | Iterable<T>;
