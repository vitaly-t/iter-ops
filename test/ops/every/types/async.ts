import {every, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<boolean>
pipeAsync(
    iterableNumber,
    every((a) => a > 5)
);
