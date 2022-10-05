import {last, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(iterableNumber, last());

// $ExpectType IterableExt<number>
pipeSync(
    iterableNumber,
    last((value, index) => true)
);
