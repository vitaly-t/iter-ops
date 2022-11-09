import {expectType} from 'tsd';

import {wait, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipe(iterableNumber, wait());
expectType<AsyncIterableExt<number>>(test1);
