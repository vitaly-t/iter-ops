import {filter, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableNumber,
    filter((a) => a > 5)
);
