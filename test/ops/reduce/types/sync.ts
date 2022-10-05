import {reduce, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

// $ExpectType IterableExt<string>
pipeSync(
    iterableNumber,
    reduce(() => 'foo')
);
