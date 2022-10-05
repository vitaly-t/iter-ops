import {map, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<string>
pipeSync(
    iterableNumber,
    map((value) => 'foo')
);
