import {start, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(
    iterableNumber,
    start((value) => true)
);
