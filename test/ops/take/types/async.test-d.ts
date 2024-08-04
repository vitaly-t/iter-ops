import {expectType} from 'tsd';

import {take, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, take(5));
expectType<AsyncIterableExt<number>>(test1);
