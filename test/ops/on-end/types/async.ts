import {onEnd, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableNumber,
    onEnd(() => {})
);
