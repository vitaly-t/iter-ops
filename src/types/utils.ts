export type IterableOf<I extends Iterable<any>> = I extends Iterable<infer T>
    ? T
    : never;

export type AsyncIterableOf<I extends AsyncIterable<any>> =
    I extends AsyncIterable<infer T> ? T : never;
