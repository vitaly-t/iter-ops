import {wait, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<Promise<number>>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterableNumber, wait());
