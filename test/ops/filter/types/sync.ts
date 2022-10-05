import {filter, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(
    iterableNumber,
    filter((a) => a > 5)
);
