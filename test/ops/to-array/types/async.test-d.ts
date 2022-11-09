import {expectType} from 'tsd';

import {toArray, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, toArray());
expectType<AsyncIterableExt<number[]>>(test1);
