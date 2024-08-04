import {expectType} from 'tsd';

import {retry, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, retry(2));
expectType<AsyncIterableExt<number>>(test1);
