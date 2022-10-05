import {first, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterableNumber, first());

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableNumber,
    first((a) => a > 5)
);
