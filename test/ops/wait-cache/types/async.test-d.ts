import {expectType} from 'tsd';

import {waitCache, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipe(iterableNumber, waitCache(2));
expectType<AsyncIterableExt<number>>(test1);
