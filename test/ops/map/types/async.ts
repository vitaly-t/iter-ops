import {map, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableNumber,
    map((value) => 'foo')
);
