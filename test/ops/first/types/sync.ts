import {first, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(iterableNumber, first());

// $ExpectType IterableExt<number>
pipeSync(
    iterableNumber,
    first((a) => a > 5)
);
