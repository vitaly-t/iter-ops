import {every, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<boolean>
pipeSync(
    iterableNumber,
    every((a) => a > 5)
);
