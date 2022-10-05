import {toArray, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number[]>
pipeAsync(iterableNumber, toArray());
