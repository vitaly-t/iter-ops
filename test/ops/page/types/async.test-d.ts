import {expectType} from 'tsd';

import {AsyncIterableExt, page, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, page(5));
expectType<AsyncIterableExt<number[]>>(test1);
