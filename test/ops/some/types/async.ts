import {some, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<boolean>
pipeAsync(
    iterableNumber,
    some((value) => true)
);
