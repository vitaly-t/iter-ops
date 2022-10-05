import {last, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterableNumber, last());

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableNumber,
    last((value, index) => true)
);
