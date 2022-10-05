import {stop, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(
    iterableNumber,
    stop((value) => true)
);
