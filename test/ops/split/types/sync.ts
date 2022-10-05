import {split, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number[]>
pipeSync(
    iterableNumber,
    split((value) => true)
);
