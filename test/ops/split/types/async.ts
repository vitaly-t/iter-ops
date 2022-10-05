import {split, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number[]>
pipeAsync(
    iterableNumber,
    split((value) => true)
);
