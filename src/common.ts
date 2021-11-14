/**
 * Pipe-through type.
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}
