import {some, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<boolean>
pipeSync(
    iterableNumber,
    some((value) => true)
);
