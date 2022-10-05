import {reduce, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<Iterable<number>>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableNumber,
    reduce(() => 'foo')
);
